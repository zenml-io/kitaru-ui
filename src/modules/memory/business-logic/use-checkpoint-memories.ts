import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { memoryQueries } from "./memory-queries";
import type { MemoryEntry } from "../domain/memory";
import {
	dedupeMemoryEntries,
	snapshotMemoryEntriesAtTime,
} from "./memory-operations";

export function useCheckpointMemories(
	flowName: string,
	executionId: string,
	checkpointStartTime?: Date
) {
	const namespaces = useQuery(memoryQueries.namespaces());
	const flow = useQuery(memoryQueries.flow(flowName));
	const execution = useQuery(memoryQueries.execution(executionId));

	const resolveEntries = checkpointStartTime
		? (entries: MemoryEntry[]) =>
				snapshotMemoryEntriesAtTime(entries, checkpointStartTime)
		: dedupeMemoryEntries;

	const namespaceEntries = useMemo(
		() => resolveEntries(namespaces.data ?? []),
		[namespaces.data, resolveEntries]
	);
	const flowEntries = useMemo(
		() => resolveEntries(flow.data ?? []),
		[flow.data, resolveEntries]
	);
	const executionEntries = useMemo(
		() => resolveEntries(execution.data ?? []),
		[execution.data, resolveEntries]
	);

	const entries = useMemo(
		() => [...namespaceEntries, ...flowEntries, ...executionEntries],
		[namespaceEntries, flowEntries, executionEntries]
	);

	return {
		entries,
		isPending: namespaces.isPending || flow.isPending || execution.isPending,
		isError: namespaces.isError || flow.isError || execution.isError,
		error: namespaces.error ?? flow.error ?? execution.error,
	};
}
