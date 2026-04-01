import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import type { TimelineEntry } from "../domain/waiting-block";
import { buildTimelineEntries } from "../domain/build-timeline-entries";
import { executionsQueries } from "./executions-queries";

export function useTimelineEntries(
	executionId: string,
	checkpoints: CheckpointEntry[]
) {
	const { data: waitingBlocks } = useQuery({
		...executionsQueries.waitConditions(executionId),
	});

	const timelineEntries = useMemo((): TimelineEntry[] => {
		return buildTimelineEntries(checkpoints, waitingBlocks ?? []);
	}, [checkpoints, waitingBlocks]);

	return { timelineEntries };
}
