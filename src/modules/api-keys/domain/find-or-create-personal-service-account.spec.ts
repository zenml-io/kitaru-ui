import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/shared/api/domain/api-client";
import { FetchError } from "@/shared/api/domain/fetch-error";

import {
	buildPersonalServiceAccountName,
	findOrCreatePersonalServiceAccount,
} from "./find-or-create-personal-service-account";

describe("buildPersonalServiceAccountName", () => {
	it("derives the hidden SA name from the user id", () => {
		expect(
			buildPersonalServiceAccountName("8a9c4e38-01d8-4a91-b9a6-111111111111")
		).toBe("pat-8a9c4e38-01d8-4a91-b9a6-111111111111");
	});
});

describe("findOrCreatePersonalServiceAccount", () => {
	const userId = "aaaa-bbbb";
	const expectedName = `pat-${userId}`;

	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns the existing SA id when the list has exactly one match", async () => {
		const get = vi.spyOn(apiClient, "GET").mockResolvedValue({
			data: {
				index: 1,
				max_size: 1,
				total_pages: 1,
				total: 1,
				items: [{ id: "sa-existing", name: expectedName }],
			},
			response: new Response(null, { status: 200 }),
		} as never);
		const post = vi.spyOn(apiClient, "POST");

		const result = await findOrCreatePersonalServiceAccount(userId);

		expect(result).toEqual({ id: "sa-existing" });
		expect(get).toHaveBeenCalledWith("/api/v1/service_accounts", {
			params: {
				query: {
					name: expectedName,
					size: 1,
					page: 1,
					hydrate: false,
				},
			},
		});
		expect(post).not.toHaveBeenCalled();
	});

	it("creates the SA when the list is empty", async () => {
		vi.spyOn(apiClient, "GET").mockResolvedValue({
			data: {
				index: 1,
				max_size: 1,
				total_pages: 0,
				total: 0,
				items: [],
			},
			response: new Response(null, { status: 200 }),
		} as never);
		const post = vi.spyOn(apiClient, "POST").mockResolvedValue({
			data: { id: "sa-new", name: expectedName },
			response: new Response(null, { status: 200 }),
		} as never);

		const result = await findOrCreatePersonalServiceAccount(userId);

		expect(result).toEqual({ id: "sa-new" });
		expect(post).toHaveBeenCalledWith("/api/v1/service_accounts", {
			body: {
				name: expectedName,
				active: true,
				description: "Personal service account for UI-managed API keys.",
			},
		});
	});

	it("recovers from a 409 conflict by re-fetching the SA", async () => {
		const get = vi.spyOn(apiClient, "GET");
		get.mockResolvedValueOnce({
			data: {
				index: 1,
				max_size: 1,
				total_pages: 0,
				total: 0,
				items: [],
			},
			response: new Response(null, { status: 200 }),
		} as never);
		const post = vi.spyOn(apiClient, "POST").mockRejectedValue(
			new FetchError({
				status: 409,
				statusText: "Conflict",
				message: "already exists",
				url: "/api/v1/service_accounts",
				method: "POST",
			})
		);
		get.mockResolvedValueOnce({
			data: {
				index: 1,
				max_size: 1,
				total_pages: 1,
				total: 1,
				items: [{ id: "sa-raced", name: expectedName }],
			},
			response: new Response(null, { status: 200 }),
		} as never);

		const result = await findOrCreatePersonalServiceAccount(userId);

		expect(result).toEqual({ id: "sa-raced" });
		expect(get).toHaveBeenCalledTimes(2);
		expect(post).toHaveBeenCalledTimes(1);
		expect(get.mock.calls[0][0]).toBe("/api/v1/service_accounts");
		expect(get.mock.calls[1][0]).toBe("/api/v1/service_accounts");
	});

	it("throws a clear error when a 409 has no raced SA to recover", async () => {
		const get = vi.spyOn(apiClient, "GET");
		const emptyPage = {
			data: {
				index: 1,
				max_size: 1,
				total_pages: 0,
				total: 0,
				items: [],
			},
			response: new Response(null, { status: 200 }),
		} as never;
		get.mockResolvedValueOnce(emptyPage);
		vi.spyOn(apiClient, "POST").mockRejectedValue(
			new FetchError({
				status: 409,
				statusText: "Conflict",
				message: "already exists",
				url: "/api/v1/service_accounts",
				method: "POST",
			})
		);
		get.mockResolvedValueOnce(emptyPage);

		await expect(findOrCreatePersonalServiceAccount(userId)).rejects.toThrow(
			/personal service account/i
		);
	});
});
