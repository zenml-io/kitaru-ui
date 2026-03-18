import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type CheckpointEntry, checkpointFromApiToDomain } from "./checkpoint";

export async function fetchCheckpoints(
	executionId: string
): Promise<CheckpointEntry[]> {
	const response = await apiClient.GET("/api/v1/runs/{run_id}/dag", {
		params: {
			path: { run_id: executionId },
		},
	});
	const dag = expectData(response);

	return dag.nodes
		.filter((node) => node.type === "step")
		.map(checkpointFromApiToDomain);
}
