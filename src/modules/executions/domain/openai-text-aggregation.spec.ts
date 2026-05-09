import { describe, expect, it } from "vitest";
import type { ExecutionLiveEvent } from "./live-event";
import { aggregateOpenAiTextStreams } from "./openai-text-aggregation";

describe("aggregateOpenAiTextStreams", () => {
	it("groups text deltas by stream id and sorts indexed chunks", () => {
		const streams = aggregateOpenAiTextStreams([
			openAiEvent({ kind: "openai_agents.stream.start", streamId: "stream-1" }),
			openAiEvent({
				kind: "openai_agents.stream.event",
				streamId: "stream-1",
				index: 2,
				textDelta: "world",
			}),
			openAiEvent({
				kind: "openai_agents.stream.event",
				streamId: "stream-1",
				index: 1,
				textDelta: "hello ",
			}),
			openAiEvent({
				kind: "openai_agents.stream.event",
				streamId: "stream-1",
				index: 2,
				textDelta: "world",
			}),
			openAiEvent({ kind: "openai_agents.stream.end", streamId: "stream-1" }),
		]);

		expect(streams).toHaveLength(1);
		expect(streams[0]).toMatchObject({
			streamId: "stream-1",
			text: "hello world",
			status: "ended",
		});
	});

	it("marks streams failed from error lifecycle events", () => {
		const streams = aggregateOpenAiTextStreams([
			openAiEvent({
				kind: "openai_agents.stream.event",
				streamId: "stream-2",
				index: 1,
				textDelta: "partial",
			}),
			openAiEvent({ kind: "openai_agents.stream.error", streamId: "stream-2" }),
		]);

		expect(streams[0]).toMatchObject({
			streamId: "stream-2",
			text: "partial",
			status: "failed",
		});
	});
});

function openAiEvent({
	kind,
	streamId,
	index,
	textDelta,
}: {
	kind: string;
	streamId: string;
	index?: number;
	textDelta?: string;
}): ExecutionLiveEvent {
	return {
		executionId: "run-1",
		kind,
		streamId,
		index,
		textDelta,
		payload: textDelta ? { text_delta: textDelta } : {},
		category: textDelta ? "openai_text_delta" : "openai_stream_lifecycle",
	};
}
