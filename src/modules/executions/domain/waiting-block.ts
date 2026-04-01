import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";

export type WaitingBlock = {
	id: string;
	question: string;
	answer: string;
	waitDurationMs?: number;
	createdAt?: Date;
};

export type TimelineEntry =
	| { kind: "checkpoint"; data: CheckpointEntry }
	| { kind: "waiting"; data: WaitingBlock };
