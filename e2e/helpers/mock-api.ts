// e2e/helpers/mock-api.ts
import type { Page, Request as PWRequest, Route } from "@playwright/test";
import type { paths } from "@/shared/api/openapi";

export type Method = "get" | "post" | "put" | "delete" | "patch";

type AvailableMethods<P extends keyof paths> = {
	[M in Method]: NonNullable<paths[P][M]> extends never ? never : M;
}[Method];

type SuccessBody<
	P extends keyof paths,
	M extends Method,
> = M extends keyof paths[P]
	? paths[P][M] extends { responses: infer R }
		? R extends { 200: { content: { "application/json": infer T } } }
			? T
			: R extends { 201: { content: { "application/json": infer T } } }
				? T
				: unknown
		: unknown
	: never;

export type CapturedRequest = {
	method: Method;
	pathname: string;
	template: string;
	body: unknown;
	pathParams: Record<string, string>;
	query: Record<string, string>;
};

export type MockEnvelope = { status: number; body?: unknown };

export type MockHandler<P extends keyof paths, M extends Method> =
	| SuccessBody<P, M>
	| MockEnvelope
	| ((
			req: CapturedRequest
	  ) =>
			| SuccessBody<P, M>
			| MockEnvelope
			| Promise<SuccessBody<P, M> | MockEnvelope>);

export type Mocks = {
	[P in keyof paths]?: {
		[M in AvailableMethods<P>]?: MockHandler<P, M>;
	};
};

const pageMocks = new WeakMap<Page, Mocks>();
const pageRequests = new WeakMap<Page, CapturedRequest[]>();
const pageRegistered = new WeakSet<Page>();

export function getRequests(page: Page): CapturedRequest[] {
	let list = pageRequests.get(page);
	if (!list) {
		list = [];
		pageRequests.set(page, list);
	}
	return list;
}

function mergeMocks(a: Mocks, b: Mocks): Mocks {
	const out: Record<string, Record<string, unknown>> = {};
	for (const [path, methods] of Object.entries(a)) {
		out[path] = { ...(methods as Record<string, unknown>) };
	}
	for (const [path, methods] of Object.entries(b)) {
		out[path] = {
			...(out[path] ?? {}),
			...(methods as Record<string, unknown>),
		};
	}
	return out as Mocks;
}

function matchTemplate(
	pathname: string,
	templates: string[]
): { template: string; params: Record<string, string> } | null {
	if (templates.includes(pathname)) {
		return { template: pathname, params: {} };
	}
	for (const template of templates) {
		if (!template.includes("{")) continue;
		const names = [...template.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]!);
		const pattern = new RegExp(
			"^" + template.replace(/\{[^}]+\}/g, "([^/]+)") + "$"
		);
		const m = pathname.match(pattern);
		if (!m) continue;
		const params = Object.fromEntries(names.map((n, i) => [n, m[i + 1]!]));
		return { template, params };
	}
	return null;
}

function parseBody(text: string | null): unknown {
	if (!text) return undefined;
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

function isEnvelope(value: unknown): value is MockEnvelope {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return false;
	}
	const obj = value as Record<string, unknown>;
	if (typeof obj.status !== "number") return false;
	return Object.keys(obj).every((k) => k === "status" || k === "body");
}

function normalizeResponse(result: unknown): { status: number; body: unknown } {
	if (isEnvelope(result)) {
		return { status: result.status, body: result.body };
	}
	return { status: 200, body: result };
}

export async function mockApi(page: Page, additions: Mocks): Promise<void> {
	const current = pageMocks.get(page) ?? {};
	pageMocks.set(page, mergeMocks(current, additions));

	if (pageRegistered.has(page)) return;
	pageRegistered.add(page);

	await page.route("**/api/v1/**", async (route: Route) => {
		try {
			const req: PWRequest = route.request();
			const url = new URL(req.url());
			const method = req.method().toLowerCase() as Method;
			const pathname = url.pathname;

			const mocks = pageMocks.get(page) ?? {};
			const match = matchTemplate(pathname, Object.keys(mocks));

			if (!match) {
				await route.fulfill({
					status: 500,
					contentType: "application/json",
					body: JSON.stringify({
						detail: `Unmocked endpoint: ${method.toUpperCase()} ${pathname}`,
					}),
				});
				return;
			}

			const methodMocks = mocks[match.template as keyof paths] as
				| Partial<Record<Method, MockHandler<keyof paths, Method>>>
				| undefined;
			const handler = methodMocks?.[method];

			if (handler === undefined) {
				await route.fulfill({
					status: 500,
					contentType: "application/json",
					body: JSON.stringify({
						detail: `Unmocked method: ${method.toUpperCase()} ${match.template}`,
					}),
				});
				return;
			}

			const captured: CapturedRequest = {
				method,
				pathname,
				template: match.template,
				body: parseBody(req.postData()),
				pathParams: match.params,
				query: Object.fromEntries(url.searchParams.entries()),
			};
			getRequests(page).push(captured);

			const result =
				typeof handler === "function"
					? await (handler as (r: CapturedRequest) => unknown)(captured)
					: handler;

			const { status, body } = normalizeResponse(result);

			await route.fulfill({
				status,
				contentType: "application/json",
				body: body === undefined ? "" : JSON.stringify(body),
			});
		} catch (err) {
			console.error(
				`[mock-api] route.fulfill() failed for ${route.request().url()}:`,
				err
			);
		}
	});
}
