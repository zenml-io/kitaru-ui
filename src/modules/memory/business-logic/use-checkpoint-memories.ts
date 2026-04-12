import { useQuery } from "@tanstack/react-query";
import { memoryQueries } from "./memory-queries";
import type { MemoryEntry } from "../domain/memory";
import {
	dedupeMemoryEntries,
	snapshotMemoryEntriesAtTime,
} from "./memory-operations";

export function useCheckpointMemories(
	currentFlowId: string,
	currentFlowName: string,
	executionId: string,
	checkpointStartTime?: Date
) {
	const namespaces = useQuery(memoryQueries.namespaces());
	const flow = useQuery(memoryQueries.flow(currentFlowId));
	const execution = useQuery(memoryQueries.execution(executionId));

	const resolveEntries = (entries: MemoryEntry[]) =>
		checkpointStartTime
			? snapshotMemoryEntriesAtTime(entries, checkpointStartTime)
			: dedupeMemoryEntries(entries);

	const namespaceEntries = resolveEntries(namespaces.data ?? []);
	const flowEntries = resolveEntries(flow.data ?? []).map((entry) => ({
		...entry,
		scopeLabel:
			entry.scope === currentFlowId ? currentFlowName : entry.scopeLabel,
	}));
	const executionEntries = resolveEntries(execution.data ?? []);

	const entries = [...namespaceEntries, ...flowEntries, ...executionEntries];

	return {
		entries,
		isPending: namespaces.isPending || flow.isPending || execution.isPending,
		isError: namespaces.isError || flow.isError || execution.isError,
		error: namespaces.error ?? flow.error ?? execution.error,
	};
}
