import { apiClient } from "@/shared/api/domain/api-client";
import { expectOptionalData } from "@/shared/api/utils/unwrap-api-result";

export async function deleteExecutionRequest(executionId: string) {
	const response = await apiClient.DELETE("/api/v1/runs/{run_id}", {
		params: {
			path: {
				run_id: executionId,
			},
		},
	});

	return expectOptionalData(response);
}
