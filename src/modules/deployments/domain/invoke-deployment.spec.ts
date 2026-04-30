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

	it("POSTs full run_configuration and returns run id on success", async () => {
		postSpy.mockResolvedValue({
			data: { id: "run-42" },
			error: undefined,
			response: new Response(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		const result = await invokeDeployment({
			snapshotId: "snap-1",
			runConfiguration: {
				enable_cache: true,
				parameters: { topic: "hi" },
			},
		});

		expect(result).toEqual({ runId: "run-42" });

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
				snapshotId: "snap-1",
				runConfiguration: { parameters: {} },
			})
		).rejects.toThrow("boom");
	});
});
