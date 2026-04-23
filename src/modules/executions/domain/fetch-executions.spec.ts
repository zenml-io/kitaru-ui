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
			data: { items: [], total: 0, page: 1, size: 1000, total_pages: 0 },
			error: undefined,
			response: new Response(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);
	});

	afterEach(() => {
		getSpy.mockRestore();
	});

	it("does not request hydrate by default", async () => {
		await fetchExecutions("flow-1");
		expect(getSpy).toHaveBeenCalledWith("/api/v1/runs", {
			params: {
				query: {
					page: 1,
					size: 1000,
					pipeline_id: "flow-1",
					source_snapshot_id: undefined,
					hydrate: undefined,
				},
			},
		});
	});

	it("requests hydrate=true when the option is passed", async () => {
		await fetchExecutions("flow-1", { hydrate: true });
		expect(getSpy).toHaveBeenCalledWith("/api/v1/runs", {
			params: {
				query: {
					page: 1,
					size: 1000,
					pipeline_id: "flow-1",
					source_snapshot_id: undefined,
					hydrate: true,
				},
			},
		});
	});

	it("forwards snapshotId to the API as source_snapshot_id", async () => {
		await fetchExecutions("flow-1", { snapshotId: "snap-42" });
		const query = getSpy.mock.calls[0][1].params.query;
		expect(query.source_snapshot_id).toBe("snap-42");
		expect(query.pipeline_id).toBe("flow-1");
	});

	it("sends source_snapshot_id as undefined when snapshotId is absent", async () => {
		await fetchExecutions("flow-1");
		const query = getSpy.mock.calls[0][1].params.query;
		expect(query.source_snapshot_id).toBeUndefined();
	});
});
