import { afterEach, describe, expect, it, vi } from "vitest";
import { FetchError } from "@zenml/shared-kitaru/api/domain";
import { queryClient } from "./query-client";

type MockWindow = Window & typeof globalThis;

function mockWindowLocation({
	pathname,
	search = "",
	hash = "",
}: {
	pathname: string;
	search?: string;
	hash?: string;
}) {
	const assign = vi.fn();

	vi.stubGlobal("window", {
		location: {
			pathname,
			search,
			hash,
			assign,
		},
	} as unknown as MockWindow);

	return assign;
}

function unauthorizedError() {
	return new FetchError({
		message: "Unauthorized",
		status: 401,
		statusText: "Unauthorized",
		url: "/api/v1/current-user",
		method: "GET",
	});
}

function serverError() {
	return new FetchError({
		message: "Internal error",
		status: 500,
		statusText: "Internal Server Error",
		url: "/api/v1/current-user",
		method: "GET",
	});
}

// `queryClient` is a module singleton; its 401 handler reads `window.location`
// at error time, so a single import works — each test just restubs `window`.
// Clear the cache between tests so query state never leaks.
describe("queryClient global 401 handling", () => {
	afterEach(() => {
		queryClient.clear();
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("redirects to login with encoded next path on 401 query errors", async () => {
		const assign = mockWindowLocation({
			pathname: "/runs/test",
			search: "?x=1&y=2",
			hash: "#frag",
		});

		await expect(
			queryClient.fetchQuery({
				queryKey: ["unauthorized-test"],
				queryFn: async () => {
					throw unauthorizedError();
				},
			})
		).rejects.toBeInstanceOf(FetchError);

		expect(assign).toHaveBeenCalledWith(
			"/login?next=%2Fruns%2Ftest%3Fx%3D1%26y%3D2%23frag"
		);
	});

	it("does not redirect when already on the login page", async () => {
		const assign = mockWindowLocation({
			pathname: "/login",
			search: "?next=%2F",
		});

		await expect(
			queryClient.fetchQuery({
				queryKey: ["login-page-unauthorized-test"],
				queryFn: async () => {
					throw unauthorizedError();
				},
			})
		).rejects.toBeInstanceOf(FetchError);

		expect(assign).not.toHaveBeenCalled();
	});

	it("does not redirect on non-401 query errors", async () => {
		const assign = mockWindowLocation({
			pathname: "/runs",
		});

		await expect(
			queryClient.fetchQuery({
				queryKey: ["non-401-test"],
				queryFn: async () => {
					throw serverError();
				},
			})
		).rejects.toBeInstanceOf(FetchError);

		expect(assign).not.toHaveBeenCalled();
	});
});
