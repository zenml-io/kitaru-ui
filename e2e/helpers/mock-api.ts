// e2e/helpers/mock-api.ts
import type { Page } from "@playwright/test";

export type Mocks = Record<string, unknown>;

const pageMocks = new WeakMap<Page, Mocks>();
const pageRegistered = new WeakSet<Page>();

export async function mockApi(page: Page, additions: Mocks): Promise<void> {
	const current = pageMocks.get(page) ?? {};
	pageMocks.set(page, { ...current, ...additions });

	if (!pageRegistered.has(page)) {
		pageRegistered.add(page);
		await page.route("**/api/v1/**", async (route) => {
			try {
				const { pathname } = new URL(route.request().url());
				const mocks = pageMocks.get(page) ?? {};
				const body = mocks[pathname];

				if (body === undefined) {
					await route.fulfill({
						status: 500,
						contentType: "application/json",
						body: JSON.stringify({ detail: `Unmocked endpoint: ${pathname}` }),
					});
					return;
				}

				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify(body),
				});
			} catch (err) {
				console.error(
					`[mock-api] route.fulfill() failed for ${route.request().url()}:`,
					err
				);
			}
		});
	}
}
