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
import { NotAKitaruDeploymentError } from "./deployment";
import { fetchDeployment } from "./fetch-deployment";

function mkSnapshot(overrides: Record<string, unknown> = {}) {
	return {
		id: "snap-1",
		name: "kitaru::research_agent::v3",
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

describe("fetchDeployment", () => {
	let getSpy: MockInstance;

	beforeEach(() => {
		getSpy = vi.spyOn(apiClient, "GET");
	});

	afterEach(() => {
		getSpy.mockRestore();
	});

	it("calls the detail endpoint with hydrate and include_config_schema enabled", async () => {
		getSpy.mockResolvedValue({
			data: mkSnapshot(),
			error: undefined,
			response: new Response(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		await fetchDeployment("snap-1");

		expect(getSpy).toHaveBeenCalledWith(
			"/api/v1/pipeline_snapshots/{snapshot_id}",
			{
				params: {
					path: { snapshot_id: "snap-1" },
					query: { hydrate: true, include_config_schema: true },
				},
			}
		);
	});

	it("returns a mapped Deployment on success", async () => {
		getSpy.mockResolvedValue({
			data: mkSnapshot(),
			error: undefined,
			response: new Response(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		const result = await fetchDeployment("snap-1");

		expect(result.id).toBe("snap-1");
		expect(result.version).toBe(3);
		expect(result.flowName).toBe("research_agent");
	});

	it("throws NotAKitaruDeploymentError when the name doesn't match", async () => {
		getSpy.mockResolvedValue({
			data: mkSnapshot({ name: "vanilla-snapshot" }),
			error: undefined,
			response: new Response(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		await expect(fetchDeployment("snap-1")).rejects.toBeInstanceOf(
			NotAKitaruDeploymentError
		);
	});
});
