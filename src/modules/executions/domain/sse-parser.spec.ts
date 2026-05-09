import { describe, expect, it } from "vitest";
import {
	createInitialSseParserState,
	flushSseParser,
	parseSseChunk,
} from "./sse-parser";

describe("SSE parser", () => {
	it("parses id, event, and multi-line data frames across chunks", () => {
		const first = parseSseChunk(
			createInitialSseParserState(),
			'id: broker-1\nevent: kitaru.checkpoint.progress\ndata: {"message":'
		);
		expect(first.frames).toEqual([]);

		const second = parseSseChunk(first.state, '"Comparing"}\ndata: tail\n\n');
		expect(second.frames).toEqual([
			{
				id: "broker-1",
				event: "kitaru.checkpoint.progress",
				data: '{"message":"Comparing"}\ntail',
			},
		]);
	});

	it("ignores heartbeat comment frames", () => {
		const parsed = parseSseChunk(
			createInitialSseParserState(),
			": keepalive\n\n"
		);
		expect(parsed.frames).toEqual([]);
	});

	it("flushes a final frame without a trailing blank line", () => {
		const parsed = parseSseChunk(
			createInitialSseParserState(),
			"event: end\ndata: {}"
		);
		const flushed = flushSseParser(parsed.state);
		expect(flushed.frames).toEqual([{ event: "end", data: "{}" }]);
	});
});
