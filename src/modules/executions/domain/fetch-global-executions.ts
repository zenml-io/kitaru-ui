import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { buildRunsQuery } from "./build-runs-query";
import { type Execution, executionFromApiToDomain } from "./execution";
import type { GlobalExecutionsQueryParams } from "./global-executions-query-params";

export type GlobalExecutionsPage = {
	items: Execution[];
	page: number;
	totalPages: number;
	total: number;
};

export async function fetchGlobalExecutions(
	params: GlobalExecutionsQueryParams
): Promise<GlobalExecutionsPage> {
	const response = await apiClient.GET("/api/v1/runs", {
		params: {
			query: buildRunsQuery(params),
		},
	});
	const page = expectData(response);
	return {
		items: page.items.map(executionFromApiToDomain),
		page: page.index,
		totalPages: page.total_pages,
		total: page.total,
	};
}
