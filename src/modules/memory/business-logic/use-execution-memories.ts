import { useQuery } from "@tanstack/react-query";
import { memoryQueries } from "./memory-queries";

export function useExecutionMemories(flowName: string, executionId: string) {
	const namespaces = useQuery(memoryQueries.namespaces());
	const flow = useQuery(memoryQueries.flow(flowName));
	const execution = useQuery(memoryQueries.execution(executionId));

	return {
		namespaceEntries: namespaces.data ?? [],
		flowEntries: flow.data ?? [],
		executionEntries: execution.data ?? [],
		isPending: namespaces.isPending || flow.isPending || execution.isPending,
		refetch: async () => {
			await Promise.all([
				namespaces.refetch(),
				flow.refetch(),
				execution.refetch(),
			]);
		},
	};
}
