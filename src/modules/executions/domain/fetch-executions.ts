import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { buildExecutionsQuery } from "./build-executions-query";
import { type Execution, executionFromApiToDomain } from "./execution";
import type { ExecutionsQueryParams } from "./global-executions-query-params";

export const DEFAULT_EXECUTIONS_POLLING_INTERVAL = 5000;

export type ExecutionsPage = {
	items: Execution[];
	page: number;
	totalPages: number;
	total: number;
};

/**
 * Single entry point for listing runs. Callers in the business-logic layer
 * shape behaviour by passing the appropriate {@link ExecutionsQueryParams}
 * (flow-scoped list, snapshot filter, hydrate, global filtered/paginated view).
 */
export async function fetchExecutions(
	params: ExecutionsQueryParams
): Promise<ExecutionsPage> {
	const response = await apiClient.GET("/api/v1/runs", {
		params: {
			query: buildExecutionsQuery(params),
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
