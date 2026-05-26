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
import { fetchExecutions } from "./fetch-executions";

describe("fetchExecutions", () => {
	let getSpy: MockInstance;

	beforeEach(() => {
		getSpy = vi.spyOn(apiClient, "GET");
		getSpy.mockResolvedValue({
			data: { items: [], total: 0, index: 1, max_size: 1000, total_pages: 0 },
			error: undefined,
			response: new Response(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);
	});

	afterEach(() => {
		getSpy.mockRestore();
	});

	it("does not request hydrate by default", async () => {
		await fetchExecutions({ flowId: "flow-1", page: 1, pageSize: 1000 });
		const query = getSpy.mock.calls[0][1].params.query;
		expect(query.pipeline_id).toBe("flow-1");
		expect(query.hydrate).toBeUndefined();
	});

	it("requests hydrate=true when the option is passed", async () => {
		await fetchExecutions({
			flowId: "flow-1",
			hydrate: true,
			page: 1,
			pageSize: 1000,
		});
		const query = getSpy.mock.calls[0][1].params.query;
		expect(query.hydrate).toBe(true);
	});

	it("forwards snapshotId to the API as source_snapshot_id", async () => {
		await fetchExecutions({ flowId: "flow-1", snapshotId: "snap-42" });
		const query = getSpy.mock.calls[0][1].params.query;
		expect(query.source_snapshot_id).toBe("snap-42");
		expect(query.pipeline_id).toBe("flow-1");
	});

	it("sends source_snapshot_id as undefined when snapshotId is absent", async () => {
		await fetchExecutions({ flowId: "flow-1" });
		const query = getSpy.mock.calls[0][1].params.query;
		expect(query.source_snapshot_id).toBeUndefined();
	});

	it("maps the global filtered query (no hydrate)", async () => {
		await fetchExecutions({
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

		const result = await fetchExecutions({
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
