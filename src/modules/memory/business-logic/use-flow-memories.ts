import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { memoryQueries } from "./memory-queries";
import { dedupeMemoryEntries } from "./memory-operations";

export function useFlowMemories(flowId: string, flowName: string) {
	const namespaces = useQuery(memoryQueries.namespaces());
	const flow = useQuery(memoryQueries.flow(flowName));
	const executions = useQuery(memoryQueries.executions(flowId));

	const namespaceEntries = useMemo(
		() => dedupeMemoryEntries(namespaces.data ?? []),
		[namespaces.data]
	);
	const flowEntries = useMemo(
		() => dedupeMemoryEntries(flow.data ?? []),
		[flow.data]
	);
	const executionEntries = useMemo(
		() => dedupeMemoryEntries(executions.data ?? []),
		[executions.data]
	);

	return {
		namespaceEntries,
		flowEntries,
		executionEntries,
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
