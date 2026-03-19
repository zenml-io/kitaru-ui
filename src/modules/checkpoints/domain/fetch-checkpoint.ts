import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type Checkpoint, checkpointFromApiToDomain } from "./checkpoint";

export async function fetchCheckpointDetails(
	checkpointId: string
): Promise<Checkpoint> {
	const response = await apiClient.GET("/api/v1/steps/{step_id}", {
		params: {
			path: { step_id: checkpointId },
			query: { hydrate: true },
		},
	});
	return checkpointFromApiToDomain(expectData(response));
}
