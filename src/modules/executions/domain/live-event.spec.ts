import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import type { ExecutionLiveEvent } from "./live-event";
import { describe, expect, it } from "vitest";
import {
	buildCheckpointIdentityLookup,
	classifyLiveEventKind,
	mapSseFrameToLiveEventAction,
	resolveLiveEventCheckpointSelection,
	shouldRefetchCheckpointDagForLiveEvent,
} from "./live-event";

describe("mapSseFrameToLiveEventAction", () => {
	it("maps checkpoint progress frames into domain events", () => {
		const action = mapSseFrameToLiveEventAction(
			{
				id: "broker-event-123",
				event: "kitaru.checkpoint.progress",
				data: JSON.stringify({
					pipeline_run_id: "run-1",
					step_run_id: "step-run-1",
					step_name: "draft_brief",
					kind: "kitaru.checkpoint.progress",
					stream_id: "kitaru.checkpoint:draft_brief:run-1",
					index: 2,
					ts: "2026-05-09T12:00:04Z",
					payload: {
						message: "Comparing claims",
						data: { percent: 0.45 },
						kitaru: {
							checkpoint_id: "step-run-1",
							checkpoint_name: "draft_brief",
						},
					},
				}),
			},
			"run-1"
		);

		expect(action).toMatchObject({
			type: "event",
			event: {
				transportId: "broker-event-123",
				executionId: "run-1",
				kind: "kitaru.checkpoint.progress",
				streamId: "kitaru.checkpoint:draft_brief:run-1",
				index: 2,
				checkpointId: "step-run-1",
				checkpointName: "draft_brief",
				message: "Comparing claims",
				progressRatio: 0.45,
				category: "checkpoint_progress",
			},
		});
	});

	it("maps gap, error, and end special frames", () => {
		expect(
			mapSseFrameToLiveEventAction(
				{ event: "gap", data: '{"reason":"buffer_overflow"}' },
				"run-1"
			)
		).toEqual({ type: "gap", reason: "buffer_overflow" });
		expect(
			mapSseFrameToLiveEventAction(
				{ event: "error", data: '{"reason":"stream_failed"}' },
				"run-1"
			)
		).toEqual({ type: "error", reason: "stream_failed" });
		expect(
			mapSseFrameToLiveEventAction({ event: "end", data: "{}" }, "run-1")
		).toEqual({ type: "end", reason: undefined });
	});
});

describe("classifyLiveEventKind", () => {
	it("keeps display-only OpenAI stream events out of custom user styling", () => {
		expect(
			classifyLiveEventKind("openai_agents.stream.event", {
				display: "Calling tool",
			})
		).toBe("openai_stream_lifecycle");
	});
});

describe("checkpoint identity lookup", () => {
	it("resolves exact step-run ids", () => {
		const checkpoint = checkpointEntry({
			id: "step-run-1",
			name: "draft_brief",
		});
		const lookup = buildCheckpointIdentityLookup([checkpoint]);
		const event: ExecutionLiveEvent = {
			executionId: "run-1",
			kind: "kitaru.checkpoint.started",
			checkpointId: "step-run-1",
			checkpointName: "draft_brief",
			payload: {},
			category: "checkpoint_lifecycle",
		};

		expect(resolveLiveEventCheckpointSelection(event, lookup)).toEqual({
			checkpointId: "step-run-1",
		});
	});

	it("requests checkpoint DAG refetch when a live event has a real id but only fallback is loaded", () => {
		const checkpoint = checkpointEntry({
			id: "step/draft_brief",
			name: "draft_brief",
		});
		const lookup = buildCheckpointIdentityLookup([checkpoint]);
		const event: ExecutionLiveEvent = {
			executionId: "run-1",
			kind: "kitaru.checkpoint.started",
			checkpointId: "step-run-1",
			checkpointName: "draft_brief",
			payload: {},
			category: "checkpoint_lifecycle",
		};

		expect(shouldRefetchCheckpointDagForLiveEvent(event, lookup)).toBe(true);
	});

	it("visibly disables selection when only a fallback node id exists", () => {
		const checkpoint = checkpointEntry({
			id: "step/draft_brief",
			name: "draft_brief",
		});
		const lookup = buildCheckpointIdentityLookup([checkpoint]);
		const event: ExecutionLiveEvent = {
			executionId: "run-1",
			kind: "kitaru.checkpoint.started",
			checkpointId: "step-run-1",
			checkpointName: "draft_brief",
			payload: {},
			category: "checkpoint_lifecycle",
		};

		expect(resolveLiveEventCheckpointSelection(event, lookup)).toEqual({
			reason: "Checkpoint details are not available yet for this live event.",
		});
	});
});

function checkpointEntry({
	id,
	name,
}: {
	id: string;
	name: string;
}): CheckpointEntry {
	return { id, name, status: "running" };
}
