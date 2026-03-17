import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type Execution, executionFromApiToDomain } from "./execution";

export async function fetchExecution(executionId: string): Promise<Execution> {
	const response = await apiClient.GET("/api/v1/runs/{run_id}", {
		params: {
			path: { run_id: executionId },
		},
	});
	return executionFromApiToDomain(expectData(response));
}
