import { checkpointsQueryKeys } from "@/modules/checkpoints/business-logic/checkpoints-queries";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useExecutionLiveEvents } from "../business-logic/use-execution-live-events";
import type { ExecutionStatus } from "../domain/execution";
import {
	resolveLiveEventCheckpointSelection,
	shouldRefetchCheckpointDagForLiveEvent,
	type ExecutionLiveEvent,
} from "../domain/live-event";
import { ExecutionLiveEventsPanel } from "../ui/ExecutionLiveEventsPanel";

type ExecutionLiveEventsPanelContainerProps = {
	executionId: string;
	executionStatus: ExecutionStatus | undefined;
	executionStartTime?: Date;
	checkpoints: CheckpointEntry[];
	onSelectCheckpoint: (checkpointId: string) => void;
};

export function ExecutionLiveEventsPanelContainer({
	executionId,
	executionStatus,
	executionStartTime,
	checkpoints,
	onSelectCheckpoint,
}: ExecutionLiveEventsPanelContainerProps) {
	const queryClient = useQueryClient();
	const invalidatedCheckpointIdsRef = useRef(new Set<string>());
	const processedRowCountRef = useRef(0);
	const liveEvents = useExecutionLiveEvents(
		executionId,
		executionStatus,
		checkpoints
	);

	useEffect(() => {
		invalidatedCheckpointIdsRef.current.clear();
		processedRowCountRef.current = 0;
	}, [executionId]);

	useEffect(() => {
		const newRows = liveEvents.rows.slice(processedRowCountRef.current);
		processedRowCountRef.current = liveEvents.rows.length;

		for (const row of newRows) {
			if (row.type !== "event" || !row.event.checkpointId) {
				continue;
			}
			if (invalidatedCheckpointIdsRef.current.has(row.event.checkpointId)) {
				continue;
			}
			if (
				shouldRefetchCheckpointDagForLiveEvent(
					row.event,
					liveEvents.checkpointLookup
				)
			) {
				invalidatedCheckpointIdsRef.current.add(row.event.checkpointId);
				queryClient.invalidateQueries({
					queryKey: checkpointsQueryKeys.all(executionId),
				});
			}
		}
	}, [executionId, liveEvents.checkpointLookup, liveEvents.rows, queryClient]);

	function resolveCheckpointSelection(event: ExecutionLiveEvent) {
		return resolveLiveEventCheckpointSelection(
			event,
			liveEvents.checkpointLookup
		);
	}

	return (
		<ExecutionLiveEventsPanel
			connection={liveEvents.connection}
			rows={liveEvents.rows}
			executionStartTime={executionStartTime}
			onRetry={liveEvents.retry}
			resolveCheckpointSelection={resolveCheckpointSelection}
			onSelectCheckpoint={onSelectCheckpoint}
		/>
	);
}
