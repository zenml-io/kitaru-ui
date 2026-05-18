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
import { fetchAllDeployments } from "./fetch-all-deployments";

function mkSnapshotItem(overrides: Record<string, unknown> = {}) {
	return {
		id: "snap-x",
		name: "kitaru::research_agent::v1",
		body: {
			created: "2026-04-22T10:00:00Z",
			updated: "2026-04-22T10:00:00Z",
			project_id: "00000000-0000-0000-0000-000000000000",
			runnable: true,
			deployable: true,
			is_dynamic: false,
		},
		metadata: {
			run_name_template: "",
			pipeline_configuration: {},
			client_version: null,
			server_version: null,
		},
		resources: {
			pipeline: {
				id: "flow-1",
				name: "research_agent",
				body: {
					created: "2026-04-22T10:00:00Z",
					updated: "2026-04-22T10:00:00Z",
					project_id: "00000000-0000-0000-0000-000000000000",
				},
			},
			tags: [],
		},
		...overrides,
	};
}

describe("fetchAllDeployments", () => {
	let getSpy: MockInstance;

	beforeEach(() => {
		getSpy = vi.spyOn(apiClient, "GET");
	});

	afterEach(() => {
		getSpy.mockRestore();
	});

	it("calls the snapshots endpoint with no pipeline filter and hydrate=true", async () => {
		getSpy.mockResolvedValue({
			data: { items: [], total: 0, index: 1, max_size: 1000, total_pages: 0 },
			error: undefined,
			response: new Response(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		await fetchAllDeployments();

		expect(getSpy).toHaveBeenCalledWith("/api/v1/pipeline_snapshots", {
			params: {
				query: {
					name: "contains:kitaru::",
					page: 1,
					size: 1000,
					hydrate: true,
				},
			},
		});
	});

	it("returns valid kitaru deployments and filters out non-Kitaru snapshots", async () => {
		getSpy.mockResolvedValue({
			data: {
				items: [
					mkSnapshotItem({ id: "snap-1", name: "kitaru::research_agent::v1" }),
					mkSnapshotItem({ id: "snap-2", name: "vanilla-snapshot" }),
					mkSnapshotItem({ id: "snap-3", name: "kitaru::research_agent::v2" }),
				],
				total: 3,
				index: 1,
				max_size: 1000,
				total_pages: 1,
			},
			error: undefined,
			response: new Response(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		const result = await fetchAllDeployments();

		expect(result.map((d) => d.id).sort()).toEqual(["snap-1", "snap-3"]);
	});
});
