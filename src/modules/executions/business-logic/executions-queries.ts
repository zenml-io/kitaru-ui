import { queryOptions } from "@tanstack/react-query";
import { fetchExecutions } from "../domain/fetch-executions";
import { fetchExecution } from "../domain/fetch-execution";

export const executionsQueryKeys = {
	all: (flowId: string) => ["executions", flowId] as const,
	detail: (executionId: string) =>
		["executions", "detail", executionId] as const,
};

export const executionsQueries = {
	all: (flowId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.all(flowId),
			queryFn: () => fetchExecutions(flowId),
		}),
	detail: (executionId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.detail(executionId),
			queryFn: () => fetchExecution(executionId),
		}),
};
