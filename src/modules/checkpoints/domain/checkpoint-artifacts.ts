import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";

export type CheckpointArtifacts = {
	inputs: Record<string, unknown>;
	outputs: Record<string, unknown>;
};

export async function fetchCheckpointArtifacts(
	checkpointId: string
): Promise<CheckpointArtifacts> {
	const response = await apiClient.GET("/api/v1/steps/{step_id}", {
		params: {
			path: { step_id: checkpointId },
			query: { hydrate: true },
		},
	});
	const checkpoint = expectData(response);

	return {
		inputs: checkpoint.resources?.inputs ?? {},
		outputs: checkpoint.resources?.outputs ?? {},
	};
}
