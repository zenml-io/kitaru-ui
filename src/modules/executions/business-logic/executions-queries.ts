import { queryOptions } from "@tanstack/react-query";
import { fetchExecutions } from "../domain/fetch-executions";
import { fetchExecution } from "../domain/fetch-execution";
import { fetchSteps } from "../domain/fetch-steps";

export const executionsQueryKeys = {
	all: (flowId: string) => ["executions", flowId] as const,
	detail: (execId: string) => ["executions", "detail", execId] as const,
	steps: (execId: string) => ["executions", "steps", execId] as const,
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
	steps: (execId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.steps(execId),
			queryFn: () => fetchSteps(execId),
		}),
};
