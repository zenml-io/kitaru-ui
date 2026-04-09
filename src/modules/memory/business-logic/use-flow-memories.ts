import { useQuery } from "@tanstack/react-query";
import { memoryQueries } from "./memory-queries";

export function useFlowMemories(flowId: string, flowName: string) {
	const namespaces = useQuery(memoryQueries.namespaces());
	const flow = useQuery(memoryQueries.flow(flowName));
	const executions = useQuery(memoryQueries.executions(flowId));

	return {
		namespaceEntries: namespaces.data ?? [],
		flowEntries: flow.data ?? [],
		executionEntries: executions.data ?? [],
		isPending: namespaces.isPending || flow.isPending || executions.isPending,
		refetch: async () => {
			await Promise.all([
				namespaces.refetch(),
				flow.refetch(),
				executions.refetch(),
			]);
		},
	};
}
