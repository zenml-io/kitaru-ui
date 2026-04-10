import { describe, expect, it } from "vitest";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import type { WaitingBlock } from "./waiting-block";
import { buildTimelineEntries } from "./build-timeline-entries";

function makeCheckpoint(id: string, startTime?: Date): CheckpointEntry {
	return {
		id,
		name: `step_${id}`,
		status: "completed",
		startTime,
	};
}

function makeWaitingBlock(id: string, createdAt?: Date): WaitingBlock {
	return {
		id,
		question: `approve ${id}?`,
		answer: "yes",
		createdAt,
	};
}

describe("buildTimelineEntries", () => {
	it("returns checkpoints as-is when there are no waiting blocks", () => {
		const checkpoints = [
			makeCheckpoint("a", new Date("2024-01-01T10:00:00Z")),
			makeCheckpoint("b", new Date("2024-01-01T11:00:00Z")),
		];

		const result = buildTimelineEntries(checkpoints, []);

		expect(result).toEqual([
			{ kind: "checkpoint", data: checkpoints[0] },
			{ kind: "checkpoint", data: checkpoints[1] },
		]);
	});

	it("returns empty array when both inputs are empty", () => {
		expect(buildTimelineEntries([], [])).toEqual([]);
	});

	it("inserts waiting block before the checkpoint it precedes", () => {
		const checkpoints = [
			makeCheckpoint("a", new Date("2024-01-01T10:00:00Z")),
			makeCheckpoint("b", new Date("2024-01-01T12:00:00Z")),
		];
		const waitingBlocks = [
			makeWaitingBlock("w1", new Date("2024-01-01T11:00:00Z")),
		];

		const result = buildTimelineEntries(checkpoints, waitingBlocks);

		expect(result.map((e) => `${e.kind}:${e.data.id}`)).toEqual([
			"checkpoint:a",
			"waiting:w1",
			"checkpoint:b",
		]);
	});

	it("places multiple waiting blocks between checkpoints in order", () => {
		const checkpoints = [
			makeCheckpoint("a", new Date("2024-01-01T10:00:00Z")),
			makeCheckpoint("b", new Date("2024-01-01T14:00:00Z")),
		];
		const waitingBlocks = [
			makeWaitingBlock("w1", new Date("2024-01-01T11:00:00Z")),
			makeWaitingBlock("w2", new Date("2024-01-01T12:00:00Z")),
		];

		const result = buildTimelineEntries(checkpoints, waitingBlocks);

		expect(result.map((e) => `${e.kind}:${e.data.id}`)).toEqual([
			"checkpoint:a",
			"waiting:w1",
			"waiting:w2",
			"checkpoint:b",
		]);
	});

	it("appends remaining waiting blocks after all checkpoints", () => {
		const checkpoints = [makeCheckpoint("a", new Date("2024-01-01T10:00:00Z"))];
		const waitingBlocks = [
			makeWaitingBlock("w1", new Date("2024-01-01T11:00:00Z")),
		];

		const result = buildTimelineEntries(checkpoints, waitingBlocks);

		expect(result.map((e) => `${e.kind}:${e.data.id}`)).toEqual([
			"checkpoint:a",
			"waiting:w1",
		]);
	});

	it("handles waiting blocks without createdAt by keeping them after checkpoints", () => {
		const checkpoints = [
			makeCheckpoint("a", new Date("2024-01-01T10:00:00Z")),
			makeCheckpoint("b", new Date("2024-01-01T12:00:00Z")),
		];
		const waitingBlocks = [makeWaitingBlock("w1")];

		const result = buildTimelineEntries(checkpoints, waitingBlocks);

		expect(result.map((e) => `${e.kind}:${e.data.id}`)).toEqual([
			"checkpoint:a",
			"checkpoint:b",
			"waiting:w1",
		]);
	});

	it("handles checkpoints without startTime by not interleaving waiting blocks before them", () => {
		const checkpoints = [makeCheckpoint("a"), makeCheckpoint("b")];
		const waitingBlocks = [
			makeWaitingBlock("w1", new Date("2024-01-01T11:00:00Z")),
		];

		const result = buildTimelineEntries(checkpoints, waitingBlocks);

		expect(result.map((e) => `${e.kind}:${e.data.id}`)).toEqual([
			"checkpoint:a",
			"checkpoint:b",
			"waiting:w1",
		]);
	});

	it("handles only waiting blocks with no checkpoints", () => {
		const waitingBlocks = [
			makeWaitingBlock("w1", new Date("2024-01-01T10:00:00Z")),
		];

		const result = buildTimelineEntries([], waitingBlocks);

		expect(result).toEqual([{ kind: "waiting", data: waitingBlocks[0] }]);
	});

	it("interleaves waiting blocks across multiple checkpoints", () => {
		const checkpoints = [
			makeCheckpoint("a", new Date("2024-01-01T10:00:00Z")),
			makeCheckpoint("b", new Date("2024-01-01T12:00:00Z")),
			makeCheckpoint("c", new Date("2024-01-01T14:00:00Z")),
		];
		const waitingBlocks = [
			makeWaitingBlock("w1", new Date("2024-01-01T11:00:00Z")),
			makeWaitingBlock("w2", new Date("2024-01-01T13:00:00Z")),
			makeWaitingBlock("w3", new Date("2024-01-01T15:00:00Z")),
		];

		const result = buildTimelineEntries(checkpoints, waitingBlocks);

		expect(result.map((e) => `${e.kind}:${e.data.id}`)).toEqual([
			"checkpoint:a",
			"waiting:w1",
			"checkpoint:b",
			"waiting:w2",
			"checkpoint:c",
			"waiting:w3",
		]);
	});
});
