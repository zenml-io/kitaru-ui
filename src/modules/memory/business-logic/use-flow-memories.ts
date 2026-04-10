import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { MemoryEntry } from "../domain/memory";
import { memoryQueries } from "./memory-queries";
import { dedupeMemoryEntries } from "./memory-operations";

function decorateFlowEntries(
	entries: MemoryEntry[],
	flowName: string
): MemoryEntry[] {
	return entries.map((entry) => ({
		...entry,
		scopeLabel: flowName,
	}));
}

export function useFlowMemories(flowId: string, flowName: string) {
	const namespaces = useQuery(memoryQueries.namespaces());
	const flow = useQuery(memoryQueries.flow(flowId));
	const executions = useQuery(memoryQueries.executions(flowId));

	const namespaceEntries = useMemo(
		() => dedupeMemoryEntries(namespaces.data ?? []),
		[namespaces.data]
	);
	const flowEntries = useMemo(
		() => decorateFlowEntries(dedupeMemoryEntries(flow.data ?? []), flowName),
		[flow.data, flowName]
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
