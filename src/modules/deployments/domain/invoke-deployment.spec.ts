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
import { invokeDeployment } from "./invoke-deployment";

describe("invokeDeployment", () => {
	let postSpy: MockInstance;

	beforeEach(() => {
		postSpy = vi.spyOn(apiClient, "POST");
	});

	afterEach(() => {
		postSpy.mockRestore();
	});

	it("POSTs full run_configuration and returns execution on success", async () => {
		postSpy.mockResolvedValue({
			data: {
				id: "run-42",
				name: "run-42",
				body: {
					created: "2026-04-17T00:00:00Z",
					updated: "2026-04-17T00:00:00Z",
					status: "running",
					index: 1,
					in_progress: false,
					project_id: "00000000-0000-0000-0000-000000000000",
				},
				resources: {
					project_id: "00000000-0000-0000-0000-000000000000",
					tags: [],
					log_collection: null,
				},
			},
			error: undefined,
			response: new Response(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		const result = await invokeDeployment({
			deploymentId: "snap-1",
			runConfiguration: {
				enable_cache: true,
				parameters: { topic: "hi" },
			},
		});

		expect(result).toMatchObject({
			id: "run-42",
			name: "run-42",
			status: "running",
			index: 1,
			logSources: [],
		});

		expect(postSpy).toHaveBeenCalledWith(
			"/api/v1/pipeline_snapshots/{snapshot_id}/runs",
			{
				body: {
					run_configuration: {
						enable_cache: true,
						parameters: { topic: "hi" },
					},
				},
				params: {
					path: { snapshot_id: "snap-1" },
				},
			}
		);
	});

	it("bubbles up api client failures", async () => {
		postSpy.mockRejectedValue(new Error("boom"));
		await expect(
			invokeDeployment({
				deploymentId: "snap-1",
				runConfiguration: { parameters: {} },
			})
		).rejects.toThrow("boom");
	});
});
