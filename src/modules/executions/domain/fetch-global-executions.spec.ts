import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
	type MockInstance,
} from "vitest";
import { apiClient } from "@/shared/api/domain/api-client";
import { fetchGlobalExecutions } from "./fetch-global-executions";

describe("fetchGlobalExecutions", () => {
	let getSpy: MockInstance;

	beforeEach(() => {
		getSpy = vi.spyOn(apiClient, "GET");
		getSpy.mockResolvedValue({
			data: { items: [], total: 0, page: 1, size: 50, total_pages: 0 },
			error: undefined,
			response: new Response(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);
	});

	afterEach(() => {
		getSpy.mockRestore();
	});

	it("calls /api/v1/runs with the mapped query (no hydrate)", async () => {
		await fetchGlobalExecutions({
			range: "all",
			sort: "desc:created",
			page: 1,
			pageSize: 50,
			status: "failed",
		});
		expect(getSpy).toHaveBeenCalledWith("/api/v1/runs", {
			params: {
				query: {
					sort_by: "desc:created",
					page: 1,
					size: 50,
					status: "failed",
				},
			},
		});
	});

	it("returns { items, page, totalPages, total }", async () => {
		getSpy.mockResolvedValueOnce({
			data: { items: [], total: 17, index: 2, max_size: 50, total_pages: 1 },
			error: undefined,
			response: new Response(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		const result = await fetchGlobalExecutions({
			range: "all",
			sort: "desc:created",
			page: 2,
			pageSize: 50,
		});

		expect(result.page).toBe(2);
		expect(result.total).toBe(17);
		expect(result.totalPages).toBe(1);
		expect(result.items).toEqual([]);
	});
});
