import { useQuery } from "@tanstack/react-query";
import { memoryQueries } from "./memory-queries";
import { dedupeMemoryEntries } from "./memory-operations";

export function useFlowMemories(flowId: string, flowName: string) {
	const namespaces = useQuery(memoryQueries.namespaces());
	const flow = useQuery(memoryQueries.flow(flowId));
	const executions = useQuery(memoryQueries.executions(flowId));

	const namespaceEntries = dedupeMemoryEntries(namespaces.data ?? []);
	const flowEntries = dedupeMemoryEntries(flow.data ?? []).map((entry) => ({
		...entry,
		scopeLabel: entry.scope === flowId ? flowName : entry.scopeLabel,
	}));
	const executionEntries = dedupeMemoryEntries(executions.data ?? []);

	return {
		namespaceEntries,
		flowEntries,
		executionEntries,
		isPending: namespaces.isPending || flow.isPending || executions.isPending,
		isError: namespaces.isError || flow.isError || executions.isError,
		error: namespaces.error ?? flow.error ?? executions.error,
		refetch: async () => {
			await Promise.all([
				namespaces.refetch(),
				flow.refetch(),
				executions.refetch(),
			]);
		},
	};
}
