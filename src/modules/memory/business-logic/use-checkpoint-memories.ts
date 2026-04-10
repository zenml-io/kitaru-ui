import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { memoryQueries } from "./memory-queries";
import type { MemoryEntry } from "../domain/memory";
import {
	decorateFlowEntries,
	dedupeMemoryEntries,
	snapshotMemoryEntriesAtTime,
} from "./memory-operations";

export function useCheckpointMemories(
	flowId: string,
	flowName: string,
	executionId: string,
	checkpointStartTime?: Date
) {
	const namespaces = useQuery(memoryQueries.namespaces());
	const flow = useQuery(memoryQueries.flow(flowId));
	const execution = useQuery(memoryQueries.execution(executionId));

	const checkpointTimestamp = checkpointStartTime?.getTime();
	const resolveEntries = useMemo<
		(entries: MemoryEntry[]) => MemoryEntry[]
	>(() => {
		return checkpointStartTime
			? (entries: MemoryEntry[]) =>
					snapshotMemoryEntriesAtTime(entries, checkpointStartTime)
			: dedupeMemoryEntries;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkpointTimestamp]);

	const namespaceEntries = useMemo(
		() => resolveEntries(namespaces.data ?? []),
		[namespaces.data, resolveEntries]
	);
	const flowEntries = useMemo(
		() => decorateFlowEntries(resolveEntries(flow.data ?? []), flowName),
		[flow.data, flowName, resolveEntries]
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
