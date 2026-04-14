import { describe, expect, it } from "vitest";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import type { TimelineEntry, WaitingBlock } from "../domain/waiting-block";
import { timelineEntryToSegment } from "./timeline-entry-to-segment";

function checkpointEntry(
	overrides: Partial<CheckpointEntry> = {}
): TimelineEntry {
	return {
		kind: "checkpoint",
		data: {
			id: "c1",
			name: "step_one",
			status: "completed",
			...overrides,
		},
	};
}

function waitingEntry(overrides: Partial<WaitingBlock> = {}): TimelineEntry {
	return {
		kind: "waiting",
		data: {
			id: "w1",
			question: "approve?",
			answer: "yes",
			...overrides,
		},
	};
}

describe("timelineEntryToSegment", () => {
	describe("checkpoint entries", () => {
		it("maps a checkpoint with a positive duration", () => {
			const entry = checkpointEntry({
				id: "c1",
				name: "train",
				type: "tool_call",
				durationMs: 12_000,
			});

			const segment = timelineEntryToSegment(entry);

			expect(segment).toEqual({
				id: "c1",
				name: "train",
				type: "tool_call",
				durationMs: 12_000,
				entry,
			});
		});

		it("keeps cached checkpoints with durationMs === 0 as a zero-duration segment", () => {
			const entry = checkpointEntry({
				id: "cached",
				name: "load_data",
				status: "cached",
				durationMs: 0,
			});

			const segment = timelineEntryToSegment(entry);

			expect(segment).not.toBeNull();
			expect(segment?.id).toBe("cached");
			expect(segment?.durationMs).toBe(0);
			expect(segment?.entry).toBe(entry);
		});

		it("treats missing durationMs as zero instead of dropping the segment", () => {
			const entry = checkpointEntry({
				id: "unknown",
				durationMs: undefined,
			});

			const segment = timelineEntryToSegment(entry);

			expect(segment).not.toBeNull();
			expect(segment?.durationMs).toBe(0);
		});

		it("clamps negative durations to zero", () => {
			const entry = checkpointEntry({ durationMs: -5 });

			const segment = timelineEntryToSegment(entry);

			expect(segment?.durationMs).toBe(0);
		});

		it("falls back to an empty string when type is undefined", () => {
			const entry = checkpointEntry({ type: undefined, durationMs: 1 });

			const segment = timelineEntryToSegment(entry);

			expect(segment?.type).toBe("");
		});
	});

	describe("waiting entries", () => {
		it("maps a waiting block with a positive wait duration", () => {
			const entry = waitingEntry({
				id: "w1",
				waitDurationMs: 5_000,
			});

			const segment = timelineEntryToSegment(entry);

			expect(segment).toEqual({
				id: "w1",
				name: "User Input",
				type: "wait",
				durationMs: 5_000,
				entry,
			});
		});

		it("keeps waiting blocks with waitDurationMs === 0 as a zero-duration segment", () => {
			const entry = waitingEntry({ waitDurationMs: 0 });

			const segment = timelineEntryToSegment(entry);

			expect(segment).not.toBeNull();
			expect(segment?.durationMs).toBe(0);
			expect(segment?.type).toBe("wait");
		});

		it("clamps negative wait durations to zero", () => {
			const entry = waitingEntry({ waitDurationMs: -10 });

			const segment = timelineEntryToSegment(entry);

			expect(segment?.durationMs).toBe(0);
		});

		it("drops waiting blocks with no waitDurationMs", () => {
			const entry = waitingEntry({ waitDurationMs: undefined });

			expect(timelineEntryToSegment(entry)).toBeNull();
		});
	});
});
