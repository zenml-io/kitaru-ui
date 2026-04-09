import { useQuery } from "@tanstack/react-query";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { buildTimelineEntries } from "../domain/build-timeline-entries";
import { executionsQueries } from "./executions-queries";

export function useTimelineEntries(
	executionId: string,
	checkpoints: CheckpointEntry[]
) {
	const { data: waitingBlocks } = useQuery({
		...executionsQueries.waitConditions(executionId),
	});

	return {
		timelineEntries: buildTimelineEntries(checkpoints, waitingBlocks ?? []),
	};
}
