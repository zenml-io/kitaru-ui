import { queryOptions } from "@tanstack/react-query";
import { fetchNamespaceMemories } from "../domain/fetch-namespace-memories";
import { fetchFlowMemories } from "../domain/fetch-flow-memories";
import { fetchExecutionMemories } from "../domain/fetch-execution-memories";
import { fetchSingleExecutionMemories } from "../domain/fetch-single-execution-memories";
import { fetchMemoryHistory } from "../domain/fetch-memory-history";
import type { MemoryScopeIdentity } from "../domain/memory";

export const memoryQueryKeys = {
	base: ["memory"] as const,
	namespaces: () => [...memoryQueryKeys.base, "namespaces"] as const,
	flow: (flowName: string) =>
		[...memoryQueryKeys.base, "flow", flowName] as const,
	executions: (flowId: string) =>
		[...memoryQueryKeys.base, "executions", flowId] as const,
	execution: (executionId: string) =>
		[...memoryQueryKeys.base, "execution", executionId] as const,
	history: (scope: MemoryScopeIdentity, key: string) =>
		[
			...memoryQueryKeys.base,
			"history",
			scope.scopeType,
			scope.scope,
			key,
		] as const,
};

export const memoryQueries = {
	namespaces: () =>
		queryOptions({
			queryKey: memoryQueryKeys.namespaces(),
			queryFn: fetchNamespaceMemories,
		}),
	flow: (flowName: string) =>
		queryOptions({
			queryKey: memoryQueryKeys.flow(flowName),
			queryFn: () => fetchFlowMemories(flowName),
		}),
	executions: (flowId: string) =>
		queryOptions({
			queryKey: memoryQueryKeys.executions(flowId),
			queryFn: () => fetchExecutionMemories(flowId),
		}),
	execution: (executionId: string) =>
		queryOptions({
			queryKey: memoryQueryKeys.execution(executionId),
			queryFn: () => fetchSingleExecutionMemories(executionId),
		}),
	history: (scope: MemoryScopeIdentity, key: string) =>
		queryOptions({
			queryKey: memoryQueryKeys.history(scope, key),
			queryFn: () => fetchMemoryHistory(scope, key),
		}),
};
