import { queryOptions } from "@tanstack/react-query";
import { fetchNamespaceMemories } from "../domain/fetch-namespace-memories";
import { fetchFlowMemories } from "../domain/fetch-flow-memories";
import { fetchExecutionMemories } from "../domain/fetch-execution-memories";
import { fetchSingleExecutionMemories } from "../domain/fetch-single-execution-memories";
import type { MemoryScopeType } from "../domain/memory";
import { fetchMemoryHistory } from "../domain/fetch-memory-history";

export const memoryQueryKeys = {
	base: ["memory"] as const,
	namespaces: () => [...memoryQueryKeys.base, "namespaces"] as const,
	flow: (flowId: string) => [...memoryQueryKeys.base, "flow", flowId] as const,
	executions: (flowId: string) =>
		[...memoryQueryKeys.base, "executions", flowId] as const,
	execution: (executionId: string) =>
		[...memoryQueryKeys.base, "execution", executionId] as const,
	history: (scope: string, scopeType: MemoryScopeType, key: string) =>
		[...memoryQueryKeys.base, "history", scope, scopeType, key] as const,
};

export const memoryQueries = {
	namespaces: () =>
		queryOptions({
			queryKey: memoryQueryKeys.namespaces(),
			queryFn: fetchNamespaceMemories,
		}),
	flow: (flowId: string) =>
		queryOptions({
			queryKey: memoryQueryKeys.flow(flowId),
			queryFn: () => fetchFlowMemories(flowId),
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
	history: (scope: string, scopeType: MemoryScopeType, key: string) =>
		queryOptions({
			queryKey: memoryQueryKeys.history(scope, scopeType, key),
			queryFn: () => fetchMemoryHistory(scope, scopeType, key),
		}),
};
