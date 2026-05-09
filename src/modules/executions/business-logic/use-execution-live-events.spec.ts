import { FetchError } from "@/shared/api/domain/fetch-error";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchExecutionEventStream } from "../domain/fetch-execution-event-stream";
import type { ExecutionLiveEvent } from "../domain/live-event";
import {
	createInitialExecutionLiveEventsState,
	executionLiveEventsReducer,
	useExecutionLiveEvents,
} from "./use-execution-live-events";

vi.mock("../domain/fetch-execution-event-stream", () => ({
	fetchExecutionEventStream: vi.fn(),
}));

const fetchExecutionEventStreamMock = vi.mocked(fetchExecutionEventStream);

afterEach(() => {
	vi.useRealTimers();
	vi.clearAllMocks();
});

describe("executionLiveEventsReducer", () => {
	it("deduplicates by transport id", () => {
		const initial = createInitialExecutionLiveEventsState();
		const event = liveEvent({ transportId: "broker-1", index: 1 });
		const withFirst = executionLiveEventsReducer(initial, {
			type: "event",
			event,
		});
		const withDuplicate = executionLiveEventsReducer(withFirst, {
			type: "event",
			event,
		});

		expect(withDuplicate.rows).toHaveLength(1);
	});

	it("deduplicates by kind, stream id, and index when no transport id exists", () => {
		const initial = createInitialExecutionLiveEventsState();
		const event = liveEvent({ streamId: "stream-1", index: 4 });
		const withFirst = executionLiveEventsReducer(initial, {
			type: "event",
			event,
		});
		const withDuplicate = executionLiveEventsReducer(withFirst, {
			type: "event",
			event,
		});

		expect(withDuplicate.rows).toHaveLength(1);
	});

	it("records gaps inline and keeps the live gap flag", () => {
		const state = executionLiveEventsReducer(
			createInitialExecutionLiveEventsState(),
			{ type: "gap", reason: "buffer_overflow" }
		);

		expect(state.rows).toEqual([
			{ type: "gap", id: "gap:0", reason: "buffer_overflow" },
		]);
		expect(state.connection).toEqual({
			status: "live",
			hadGap: true,
			hadDisconnect: false,
		});
	});

	it("keeps possibly-missed state visible after reconnecting opens again", () => {
		const live = executionLiveEventsReducer(
			createInitialExecutionLiveEventsState(),
			{
				type: "opened",
			}
		);
		const reconnecting = executionLiveEventsReducer(live, {
			type: "reconnecting",
			reason: "connection_lost",
		});
		const reopened = executionLiveEventsReducer(reconnecting, {
			type: "opened",
		});

		expect(reopened.connection).toEqual({
			status: "live",
			hadGap: false,
			hadDisconnect: true,
		});
	});

	it("sets reconnecting and ended error states without dropping prior rows", () => {
		const withEvent = executionLiveEventsReducer(
			createInitialExecutionLiveEventsState(),
			{ type: "event", event: liveEvent({ transportId: "broker-1" }) }
		);
		const reconnecting = executionLiveEventsReducer(withEvent, {
			type: "reconnecting",
			reason: "connection_lost",
		});
		const errored = executionLiveEventsReducer(reconnecting, {
			type: "server-error",
			reason: "stream_failed",
		});

		expect(errored.rows).toHaveLength(1);
		expect(errored.connection).toEqual({
			status: "ended",
			reason: "stream_error",
			canRetry: true,
			hadGap: false,
			hadDisconnect: true,
		});
	});
});

describe("useExecutionLiveEvents", () => {
	it("ends as retryable disconnected after repeated stream failures", async () => {
		vi.useFakeTimers();
		fetchExecutionEventStreamMock.mockRejectedValue(
			new FetchError({ message: "Forbidden", status: 403, url: "/events" })
		);

		const { result } = renderHook(() =>
			useExecutionLiveEvents("run-1", "running", [])
		);

		await act(async () => {
			await Promise.resolve();
			await vi.advanceTimersByTimeAsync(1_000);
			await Promise.resolve();
			await vi.advanceTimersByTimeAsync(1_000);
			await Promise.resolve();
		});

		expect(result.current.connection).toEqual({
			status: "ended",
			reason: "disconnected",
			canRetry: true,
			hadGap: false,
			hadDisconnect: true,
		});
		expect(fetchExecutionEventStreamMock).toHaveBeenCalledTimes(3);
	});
});

function liveEvent({
	transportId,
	streamId = "checkpoint-stream",
	index,
}: {
	transportId?: string;
	streamId?: string;
	index?: number;
}): ExecutionLiveEvent {
	return {
		transportId,
		executionId: "run-1",
		kind: "kitaru.checkpoint.progress",
		streamId,
		index,
		payload: {},
		category: "checkpoint_progress",
	};
}
