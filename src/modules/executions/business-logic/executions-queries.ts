import { queryOptions } from "@tanstack/react-query";
import { fetchExecutions } from "../domain/fetch-executions";
import { fetchExecution } from "../domain/fetch-execution";
import { fetchWaitCondition } from "../domain/fetch-wait-condition";
import { fetchWaitConditions } from "../domain/fetch-wait-conditions";

export const executionsQueryKeys = {
	base: ["executions"] as const,
	all: (flowId: string) => [...executionsQueryKeys.base, flowId] as const,
	detail: (executionId: string) =>
		[...executionsQueryKeys.base, "detail", executionId] as const,
	waitCondition: (waitConditionId: string) =>
		[...executionsQueryKeys.base, "waitCondition", waitConditionId] as const,
	waitConditions: (executionId: string) =>
		[...executionsQueryKeys.base, "waitConditions", executionId] as const,
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
};
