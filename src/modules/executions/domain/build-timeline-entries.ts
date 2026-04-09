import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import type { TimelineEntry, WaitingBlock } from "./waiting-block";

export function buildTimelineEntries(
	checkpoints: CheckpointEntry[],
	waitingBlocks: WaitingBlock[]
): TimelineEntry[] {
	const entries: TimelineEntry[] = [];
	let waitIdx = 0;

	for (const checkpoint of checkpoints) {
		while (
			waitIdx < waitingBlocks.length &&
			waitingBlocks[waitIdx].createdAt &&
			checkpoint.startTime &&
			waitingBlocks[waitIdx].createdAt! < checkpoint.startTime
		) {
			entries.push({ kind: "waiting", data: waitingBlocks[waitIdx++] });
		}
		entries.push({ kind: "checkpoint", data: checkpoint });
	}

	while (waitIdx < waitingBlocks.length) {
		entries.push({ kind: "waiting", data: waitingBlocks[waitIdx++] });
	}

	return entries;
}
