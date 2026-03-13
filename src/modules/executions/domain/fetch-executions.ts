import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type Execution, executionFromApiToDomain } from "./execution";

export async function fetchExecutions(): Promise<Execution[]> {
	const response = await apiClient.GET("/api/v1/runs", {
		params: {
			query: {
				page: 1,
				size: 1000,
			},
		},
	});
	const executionsPage = expectData(response);

	return executionsPage.items.map(executionFromApiToDomain);
}
