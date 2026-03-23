import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type Execution, executionFromApiToDomain } from "./execution";

// TODO: Remove these constants and use the API pagination instead
const DEFAULT_PAGE = 1;
const MAX_PAGE_SIZE = 1000;
const DEFAULT_SORT_BY = "desc:created";

export async function fetchExecutions(flowId: string): Promise<Execution[]> {
	const response = await apiClient.GET("/api/v1/runs", {
		params: {
			query: {
				sort_by: DEFAULT_SORT_BY,
				page: DEFAULT_PAGE,
				size: MAX_PAGE_SIZE,
				pipeline_id: flowId,
			},
		},
	});
	const executionsPage = expectData(response);

	return executionsPage.items.map(executionFromApiToDomain);
}
