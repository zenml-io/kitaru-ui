import { env } from "@/modules/root/domain/env";
import { FetchError } from "@/shared/api/domain/fetch-error";
import { getCsrfToken } from "@/shared/api/utils/csrf-token-cookie";
import {
	createInitialSseParserState,
	flushSseParser,
	parseSseChunk,
	type SseFrame,
	type SseParserState,
} from "./sse-parser";

export type FetchExecutionEventStreamParams = {
	executionId: string;
	lastEventId?: string;
	signal: AbortSignal;
	onOpen?: () => void;
	onFrame: (frame: SseFrame) => boolean | void;
};

export function buildExecutionEventStreamUrl(executionId: string): string {
	return `${env.VITE_API_BASE_URL}/api/v1/runs/${encodeURIComponent(
		executionId
	)}/events/stream`;
}

export function buildExecutionEventStreamHeaders(
	lastEventId?: string
): Headers {
	const headers = new Headers({
		Accept: "text/event-stream",
		"Source-Context": "kitaru-ui",
	});
	const csrfToken = getCsrfToken();
	if (csrfToken) {
		headers.set("X-CSRF-Token", csrfToken);
	}
	if (lastEventId) {
		headers.set("Last-Event-ID", lastEventId);
	}
	return headers;
}

export async function fetchExecutionEventStream({
	executionId,
	lastEventId,
	signal,
	onOpen,
	onFrame,
}: FetchExecutionEventStreamParams): Promise<void> {
	const url = buildExecutionEventStreamUrl(executionId);
	const response = await fetch(url, {
		method: "GET",
		credentials: "include",
		signal,
		headers: buildExecutionEventStreamHeaders(lastEventId),
	});

	if (!response.ok) {
		throw await buildStreamFetchError(response, url);
	}
	if (!response.body) {
		throw new FetchError({
			status: response.status,
			statusText: response.statusText,
			message: "Live event stream response did not include a readable body.",
			url,
			method: "GET",
		});
	}

	onOpen?.();
	await readFrames(response.body.getReader(), onFrame);
}

async function readFrames(
	reader: ReadableStreamDefaultReader<Uint8Array>,
	onFrame: (frame: SseFrame) => boolean | void
): Promise<void> {
	const textDecoder = new TextDecoder();
	let parserState: SseParserState = createInitialSseParserState();

	try {
		while (true) {
			const { value, done } = await reader.read();
			if (done) {
				const tail = textDecoder.decode();
				if (tail) {
					const parsedTail = parseSseChunk(parserState, tail);
					parserState = parsedTail.state;
					const shouldContinue = await emitFrames(parsedTail.frames, onFrame);
					if (!shouldContinue) {
						return;
					}
				}

				const flushed = flushSseParser(parserState);
				await emitFrames(flushed.frames, onFrame);
				return;
			}

			const parsed = parseSseChunk(
				parserState,
				textDecoder.decode(value, { stream: true })
			);
			parserState = parsed.state;
			const shouldContinue = await emitFrames(parsed.frames, onFrame);
			if (!shouldContinue) {
				await reader.cancel();
				return;
			}
		}
	} finally {
		reader.releaseLock();
	}
}

async function emitFrames(
	frames: SseFrame[],
	onFrame: (frame: SseFrame) => boolean | void
): Promise<boolean> {
	for (const frame of frames) {
		if (onFrame(frame) === false) {
			return false;
		}
	}
	return true;
}

async function buildStreamFetchError(
	response: Response,
	url: string
): Promise<FetchError> {
	const body = await response.text().catch(() => "");
	return new FetchError({
		status: response.status,
		statusText: response.statusText,
		message: body || response.statusText || "Live event stream request failed.",
		url,
		method: "GET",
		details: body,
	});
}
