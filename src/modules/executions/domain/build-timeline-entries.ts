import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import type { TimelineEntry, WaitingBlock } from "./waiting-block";

export function buildTimelineEntries(
	checkpoints: CheckpointEntry[],
	waitingBlocks: WaitingBlock[]
): TimelineEntry[] {
	if (waitingBlocks.length === 0) {
		return checkpoints.map((cp) => ({
			kind: "checkpoint" as const,
			data: cp,
		}));
	}

	const entries: TimelineEntry[] = [];
	const remainingBlocks = [...waitingBlocks];

	for (const checkpoint of checkpoints) {
		while (remainingBlocks.length > 0) {
			const block = remainingBlocks[0];
			if (
				block.createdAt &&
				checkpoint.startTime &&
				block.createdAt < checkpoint.startTime
			) {
				entries.push({ kind: "waiting", data: remainingBlocks.shift()! });
			} else {
				break;
			}
		}
		entries.push({ kind: "checkpoint", data: checkpoint });
	}

	for (const block of remainingBlocks) {
		entries.push({ kind: "waiting", data: block });
	}

	return entries;
}
