import { afterEach, describe, expect, it, vi } from "vitest";

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

type FetchErrorClass =
	typeof import("@/shared/api/domain/fetch-error").FetchError;

function unauthorizedError(FetchError: FetchErrorClass) {
	return new FetchError({
		message: "Unauthorized",
		status: 401,
		statusText: "Unauthorized",
		url: "/api/v1/current-user",
		method: "GET",
	});
}

function serverError(FetchError: FetchErrorClass) {
	return new FetchError({
		message: "Internal error",
		status: 500,
		statusText: "Internal Server Error",
		url: "/api/v1/current-user",
		method: "GET",
	});
}

async function getFreshQueryClient() {
	vi.resetModules();
	const { queryClient } = await import("./query-client");
	const { FetchError } = await import("@/shared/api/domain/fetch-error");
	return { queryClient, FetchError };
}

describe("queryClient global 401 handling", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("redirects to login with encoded next path on 401 query errors", async () => {
		const assign = mockWindowLocation({
			pathname: "/runs/test",
			search: "?x=1&y=2",
			hash: "#frag",
		});
		const { queryClient, FetchError } = await getFreshQueryClient();

		await expect(
			queryClient.fetchQuery({
				queryKey: ["unauthorized-test"],
				queryFn: async () => {
					throw unauthorizedError(FetchError);
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
		const { queryClient, FetchError } = await getFreshQueryClient();

		await expect(
			queryClient.fetchQuery({
				queryKey: ["login-page-unauthorized-test"],
				queryFn: async () => {
					throw unauthorizedError(FetchError);
				},
			})
		).rejects.toBeInstanceOf(FetchError);

		expect(assign).not.toHaveBeenCalled();
	});

	it("does not redirect on non-401 query errors", async () => {
		const assign = mockWindowLocation({
			pathname: "/runs",
		});
		const { queryClient, FetchError } = await getFreshQueryClient();

		await expect(
			queryClient.fetchQuery({
				queryKey: ["non-401-test"],
				queryFn: async () => {
					throw serverError(FetchError);
				},
			})
		).rejects.toBeInstanceOf(FetchError);

		expect(assign).not.toHaveBeenCalled();
	});
});
