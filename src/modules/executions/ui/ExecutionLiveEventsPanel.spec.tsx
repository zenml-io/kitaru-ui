import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CheckpointSelectionResolution } from "../domain/live-event";
import type { ExecutionLiveEvent } from "../domain/live-event";
import type { ExecutionLiveEventsRow } from "../domain/live-event-state";
import { ExecutionLiveEventsPanel } from "./ExecutionLiveEventsPanel";

afterEach(() => {
	cleanup();
});

describe("ExecutionLiveEventsPanel", () => {
	it("shows the connecting empty state", () => {
		renderPanel({ rows: [] });

		expect(screen.getByText("Live events")).toBeTruthy();
		expect(screen.getByText("connecting")).toBeTruthy();
		expect(screen.getByText("Opening live event stream…")).toBeTruthy();
	});

	it("renders healthy live rows without a top warning banner", () => {
		renderPanel({
			connection: { status: "live", hadGap: false, hadDisconnect: false },
			rows: [eventRow(liveEvent({ message: "Comparing claims" }))],
		});

		expect(screen.getAllByText("live").length).toBeGreaterThan(0);
		expect(screen.getByText("Comparing claims")).toBeTruthy();
		expect(screen.queryByText(/paused/i)).toBeNull();
	});

	it("renders an inline gap row", () => {
		renderPanel({
			connection: { status: "live", hadGap: true, hadDisconnect: false },
			rows: [
				eventRow(liveEvent({ message: "Started" })),
				{ type: "gap", id: "gap:1", reason: "buffer_overflow" },
				eventRow(liveEvent({ message: "Recovered" }), "row:2"),
			],
		});

		expect(
			screen.getByText(/Some live events may be missing here/)
		).toBeTruthy();
		expect(screen.getByText(/buffer_overflow/)).toBeTruthy();
		expect(screen.queryByText(/Connection was interrupted/)).toBeNull();
	});

	it("renders unavailable copy clearly", () => {
		renderPanel({
			connection: {
				status: "ended",
				reason: "unavailable",
				canRetry: false,
				hadGap: false,
				hadDisconnect: false,
			},
			rows: [],
		});

		expect(
			screen.getAllByText(
				"Live events aren't available on this server. Logs and checkpoints are still up to date."
			)
		).toHaveLength(2);
	});

	it("shows the top interruption banner after reconnect succeeds", () => {
		renderPanel({
			connection: { status: "live", hadGap: false, hadDisconnect: true },
			rows: [eventRow(liveEvent({ message: "Recovered" }))],
		});

		expect(screen.getByText(/Connection was interrupted/)).toBeTruthy();
	});

	it("aggregates OpenAI deltas into one card", () => {
		renderPanel({
			connection: { status: "live", hadGap: false, hadDisconnect: false },
			rows: [
				eventRow(
					liveEvent({
						kind: "openai_agents.stream.start",
						category: "openai_stream_lifecycle",
						streamId: "stream-1",
					})
				),
				eventRow(
					liveEvent({
						kind: "openai_agents.stream.event",
						category: "openai_text_delta",
						streamId: "stream-1",
						index: 2,
						textDelta: "world",
					})
				),
				eventRow(
					liveEvent({
						kind: "openai_agents.stream.event",
						category: "openai_text_delta",
						streamId: "stream-1",
						index: 1,
						textDelta: "hello ",
					})
				),
			],
		});

		expect(screen.getByText("OpenAI stream started")).toBeTruthy();
		expect(screen.getByText(/hello world/)).toBeTruthy();
	});
});

function renderPanel({
	connection = { status: "connecting" },
	rows,
	resolveCheckpointSelection = () => ({}),
}: {
	connection?: Parameters<typeof ExecutionLiveEventsPanel>[0]["connection"];
	rows: ExecutionLiveEventsRow[];
	resolveCheckpointSelection?: (
		event: ExecutionLiveEvent
	) => CheckpointSelectionResolution;
}) {
	return render(
		<ExecutionLiveEventsPanel
			connection={connection}
			rows={rows}
			executionStartTime={new Date("2026-05-09T12:00:00Z")}
			onRetry={vi.fn()}
			resolveCheckpointSelection={resolveCheckpointSelection}
			onSelectCheckpoint={vi.fn()}
		/>
	);
}

function eventRow(
	event: ExecutionLiveEvent,
	id = "row:1"
): ExecutionLiveEventsRow {
	return { type: "event", id, event };
}

function liveEvent({
	kind = "kitaru.checkpoint.progress",
	category = "checkpoint_progress",
	message,
	streamId = "stream-1",
	index,
	textDelta,
}: {
	kind?: ExecutionLiveEvent["kind"];
	category?: ExecutionLiveEvent["category"];
	message?: string;
	streamId?: string;
	index?: number;
	textDelta?: string;
}): ExecutionLiveEvent {
	return {
		executionId: "run-1",
		kind,
		streamId,
		index,
		message,
		textDelta,
		payload: textDelta ? { text_delta: textDelta } : {},
		category,
	};
}
