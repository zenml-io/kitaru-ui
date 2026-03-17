import { queryOptions } from "@tanstack/react-query";
import { fetchExecutions } from "../domain/fetch-executions";
import { fetchExecution } from "../domain/fetch-execution";

export const executionsQueryKeys = {
	all: (flowId: string) => ["executions", flowId] as const,
	detail: (execId: string) => ["executions", "detail", execId] as const,
};

export const executionsQueries = {
	all: (flowId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.all(flowId),
			queryFn: () => fetchExecutions(flowId),
		}),
	detail: (execId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.detail(execId),
			queryFn: () => fetchExecution(execId),
		}),
};
