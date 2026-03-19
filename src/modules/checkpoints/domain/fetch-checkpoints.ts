import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { checkpointFromApiToDomain, type DagResponse } from "./checkpoint";

export async function fetchCheckpoints(
	executionId: string
): Promise<DagResponse> {
	const response = await apiClient.GET("/api/v1/runs/{run_id}/dag", {
		params: {
			path: { run_id: executionId },
		},
	});
	const dag = expectData(response);

	return {
		executionStatus: dag.status,
		nodes: dag.nodes
			.filter((node) => node.type === "step")
			.map(checkpointFromApiToDomain),
	};
}
