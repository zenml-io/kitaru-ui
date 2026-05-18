import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { fetchExecution } from "../domain/fetch-execution";
import { fetchExecutionLogs } from "../domain/fetch-execution-logs";
import { type ExecutionsPage, fetchExecutions } from "../domain/fetch-executions";
import { fetchWaitCondition } from "../domain/fetch-wait-condition";
import { fetchWaitConditions } from "../domain/fetch-wait-conditions";
import {
	DEFAULT_GLOBAL_EXECUTIONS_PAGE_SIZE,
	type GlobalExecutionsQueryParams,
	type GlobalExecutionsSearch,
} from "../domain/global-executions-query-params";

export const executionsQueryKeys = {
	base: ["executions"] as const,
	all: (flowId: string, snapshotId?: string) =>
		snapshotId
			? ([...executionsQueryKeys.base, flowId, "snapshot", snapshotId] as const)
			: ([...executionsQueryKeys.base, flowId] as const),
	listWithSnapshots: (flowId: string) =>
		[...executionsQueryKeys.base, "list-with-snapshots", flowId] as const,
	detail: (executionId: string) =>
		[...executionsQueryKeys.base, "detail", executionId] as const,
	logs: (runId: string, source: string) =>
		[...executionsQueryKeys.base, "logs", runId, source] as const,
	waitCondition: (waitConditionId: string) =>
		[...executionsQueryKeys.base, "waitCondition", waitConditionId] as const,
	waitConditions: (executionId: string) =>
		[...executionsQueryKeys.base, "waitConditions", executionId] as const,
	global: (search: GlobalExecutionsSearch) =>
		[...executionsQueryKeys.base, "global", search] as const,
};

// Maps the URL search to the API-consumable query params. Lives here so the
// route loader and the container both just pass `search` and stay in sync.
function searchToGlobalExecutionsParams(
	search: GlobalExecutionsSearch
): GlobalExecutionsQueryParams {
	return {
		status: search.status,
		flowId: search.flow,
		snapshotId: search.version,
		stackId: search.stack,
		range: search.range,
		search: search.q,
		sort: search.sort,
		page: search.page,
		pageSize: DEFAULT_GLOBAL_EXECUTIONS_PAGE_SIZE,
	};
}

// TODO: Drop this once flow-scoped lists move to real API pagination.
const FLOW_SCOPED_PAGE_SIZE = 1000;

const toItems = (page: ExecutionsPage) => page.items;

export const executionsQueries = {
	all: (flowId: string, snapshotId?: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.all(flowId, snapshotId),
			queryFn: () =>
				fetchExecutions({
					flowId,
					snapshotId,
					page: 1,
					pageSize: FLOW_SCOPED_PAGE_SIZE,
				}),
			select: toItems,
		}),
	listWithSnapshots: (flowId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.listWithSnapshots(flowId),
			queryFn: () =>
				fetchExecutions({
					flowId,
					hydrate: true,
					page: 1,
					pageSize: FLOW_SCOPED_PAGE_SIZE,
				}),
			select: toItems,
		}),
	detail: (executionId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.detail(executionId),
			queryFn: () => fetchExecution(executionId),
		}),
	logs: (runId: string, source: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.logs(runId, source),
			queryFn: () => fetchExecutionLogs(runId, source),
		}),
	waitCondition: (waitConditionId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.waitCondition(waitConditionId),
			queryFn: () => fetchWaitCondition(waitConditionId),
		}),
	waitConditions: (executionId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.waitConditions(executionId),
			queryFn: () => fetchWaitConditions(executionId),
		}),
	global: (search: GlobalExecutionsSearch) =>
		queryOptions({
			queryKey: executionsQueryKeys.global(search),
			queryFn: () => fetchExecutions(searchToGlobalExecutionsParams(search)),
			placeholderData: keepPreviousData,
		}),
};
