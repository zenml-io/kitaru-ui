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
					hydrate: true,
				},
			},
		});
	});
});
