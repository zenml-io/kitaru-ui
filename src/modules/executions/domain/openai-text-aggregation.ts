import type { ExecutionLiveEvent } from "./live-event";

export type OpenAiTextStreamStatus = "streaming" | "ended" | "failed";

export type OpenAiTextStream = {
	streamId: string;
	display?: string;
	text: string;
	status: OpenAiTextStreamStatus;
	firstEvent: ExecutionLiveEvent;
	lastEvent: ExecutionLiveEvent;
};

type OpenAiTextChunk = {
	key: string;
	index?: number;
	text: string;
	arrival: number;
};

type MutableOpenAiStream = {
	streamId: string;
	display?: string;
	status: OpenAiTextStreamStatus;
	firstEvent: ExecutionLiveEvent;
	lastEvent: ExecutionLiveEvent;
	chunks: OpenAiTextChunk[];
	chunkKeys: Set<string>;
};

export function aggregateOpenAiTextStreams(
	events: ExecutionLiveEvent[]
): OpenAiTextStream[] {
	const streams = new Map<string, MutableOpenAiStream>();
	const order: string[] = [];

	events.forEach((event, arrival) => {
		if (!isOpenAiStreamEvent(event)) {
			return;
		}

		const streamId = getOpenAiStreamId(event);
		const stream = getOrCreateStream({ streams, order, streamId, event });
		stream.lastEvent = event;
		stream.display = event.display ?? stream.display;

		if (event.kind === "openai_agents.stream.end") {
			stream.status = "ended";
		} else if (event.kind === "openai_agents.stream.error") {
			stream.status = "failed";
		} else if (event.textDelta !== undefined) {
			const chunkKey =
				event.index !== undefined
					? `index:${event.index}`
					: `arrival:${arrival}:${event.textDelta}`;
			if (!stream.chunkKeys.has(chunkKey)) {
				stream.chunkKeys.add(chunkKey);
				stream.chunks.push({
					key: chunkKey,
					index: event.index,
					text: event.textDelta,
					arrival,
				});
			}
		}
	});

	return order.map((streamId) => toOpenAiTextStream(streams.get(streamId)));
}

export function getOpenAiStreamId(event: ExecutionLiveEvent): string {
	return event.streamId ?? "openai-stream";
}

function isOpenAiStreamEvent(event: ExecutionLiveEvent): boolean {
	return event.kind.startsWith("openai_agents.stream.");
}

function getOrCreateStream({
	streams,
	order,
	streamId,
	event,
}: {
	streams: Map<string, MutableOpenAiStream>;
	order: string[];
	streamId: string;
	event: ExecutionLiveEvent;
}): MutableOpenAiStream {
	const existing = streams.get(streamId);
	if (existing) {
		return existing;
	}

	const created: MutableOpenAiStream = {
		streamId,
		display: event.display,
		status: "streaming",
		firstEvent: event,
		lastEvent: event,
		chunks: [],
		chunkKeys: new Set(),
	};
	streams.set(streamId, created);
	order.push(streamId);
	return created;
}

function toOpenAiTextStream(
	stream: MutableOpenAiStream | undefined
): OpenAiTextStream {
	if (!stream) {
		throw new Error("OpenAI stream order referenced a missing stream.");
	}

	const chunks = [...stream.chunks].sort((a, b) => {
		if (a.index !== undefined && b.index !== undefined) {
			return a.index - b.index;
		}
		if (a.index !== undefined) {
			return -1;
		}
		if (b.index !== undefined) {
			return 1;
		}
		return a.arrival - b.arrival;
	});

	return {
		streamId: stream.streamId,
		display: stream.display,
		text: chunks.map((chunk) => chunk.text).join(""),
		status: stream.status,
		firstEvent: stream.firstEvent,
		lastEvent: stream.lastEvent,
	};
}
