import { describe, expect, it } from "vitest";
import type { components } from "@/shared/api/openapi";
import {
	extractLogSources,
	logSourceFromApiToDomain,
	logSourceFromDomainToApi,
	logsFromApiToDomain,
} from "./log-mapper";
import type { LogEntryApiType } from "./log-entry";

describe("logsFromApiToDomain", () => {
	it("passes through a single non-chunked entry", () => {
		const entries: LogEntryApiType[] = [
			{
				id: "11111111-1111-1111-1111-111111111111",
				message: "hello world",
				level: 20,
				timestamp: "2026-04-16T09:41:00.003Z",
				chunk_index: 0,
				total_chunks: 1,
			},
		];
		const result = logsFromApiToDomain(entries);
		expect(result).toHaveLength(1);
		expect(result[0].message).toBe("hello world");
		expect(result[0].originalEntry).toBe(
			"[INFO] 2026-04-16T09:41:00.003Z hello world"
		);
	});

	it("reassembles multi-chunk entries sharing the same id", () => {
		const entries: LogEntryApiType[] = [
			{
				id: "aaaa",
				message: "part one ",
				level: 20,
				timestamp: "2026-04-16T09:41:00.003Z",
				chunk_index: 0,
				total_chunks: 2,
			},
			{
				id: "aaaa",
				message: "part two",
				level: 20,
				timestamp: "2026-04-16T09:41:00.003Z",
				chunk_index: 1,
				total_chunks: 2,
			},
		];
		const result = logsFromApiToDomain(entries);
		expect(result).toHaveLength(1);
		expect(result[0].message).toBe("part one part two");
	});

	it("sorts chunks by chunk_index before concatenating", () => {
		const entries: LogEntryApiType[] = [
			{
				id: "bbbb",
				message: "BBB",
				chunk_index: 2,
				total_chunks: 3,
			},
			{
				id: "bbbb",
				message: "AAA",
				chunk_index: 0,
				total_chunks: 3,
			},
			{
				id: "bbbb",
				message: "XXX",
				chunk_index: 1,
				total_chunks: 3,
			},
		];
		const result = logsFromApiToDomain(entries);
		expect(result).toHaveLength(1);
		expect(result[0].message).toBe("AAAXXXBBB");
	});

	it("groups chunks by composite key when id is missing", () => {
		const entries: LogEntryApiType[] = [
			{
				message: "hello ",
				level: 20,
				timestamp: "2026-04-16T09:41:00.003Z",
				module: "m",
				filename: "f",
				lineno: 1,
				chunk_index: 0,
				total_chunks: 2,
			},
			{
				message: "world",
				level: 20,
				timestamp: "2026-04-16T09:41:00.003Z",
				module: "m",
				filename: "f",
				lineno: 1,
				chunk_index: 1,
				total_chunks: 2,
			},
		];
		const result = logsFromApiToDomain(entries);
		expect(result).toHaveLength(1);
		expect(result[0].message).toBe("hello world");
	});

	it("preserves order of distinct entries", () => {
		const entries: LogEntryApiType[] = [
			{ id: "1", message: "first", chunk_index: 0, total_chunks: 1 },
			{ id: "2", message: "second", chunk_index: 0, total_chunks: 1 },
			{ id: "3", message: "third", chunk_index: 0, total_chunks: 1 },
		];
		const result = logsFromApiToDomain(entries);
		expect(result.map((e) => e.message)).toEqual(["first", "second", "third"]);
	});

	it("formats originalEntry with empty prefix when level/timestamp are missing", () => {
		const entries: LogEntryApiType[] = [
			{ id: "1", message: "bare", chunk_index: 0, total_chunks: 1 },
		];
		const result = logsFromApiToDomain(entries);
		expect(result[0].originalEntry).toBe("bare");
	});

	it("returns an empty array for empty input", () => {
		expect(logsFromApiToDomain([])).toEqual([]);
	});
});

describe("logSourceFromApiToDomain", () => {
	it("maps 'step' to 'checkpoint'", () => {
		expect(logSourceFromApiToDomain("step")).toBe("checkpoint");
	});

	it("maps 'prepare_step' to 'prepare_checkpoint'", () => {
		expect(logSourceFromApiToDomain("prepare_step")).toBe("prepare_checkpoint");
	});

	it("passes through unknown sources unchanged", () => {
		expect(logSourceFromApiToDomain("custom_source")).toBe("custom_source");
	});
});

describe("logSourceFromDomainToApi", () => {
	it("maps 'checkpoint' to 'step'", () => {
		expect(logSourceFromDomainToApi("checkpoint")).toBe("step");
	});

	it("maps 'prepare_checkpoint' to 'prepare_step'", () => {
		expect(logSourceFromDomainToApi("prepare_checkpoint")).toBe("prepare_step");
	});

	it("passes through unknown sources unchanged", () => {
		expect(logSourceFromDomainToApi("custom_source")).toBe("custom_source");
	});
});

describe("extractLogSources", () => {
	type LogsResponse = components["schemas"]["LogsResponse"];

	function mkResponse(source: string | undefined): LogsResponse {
		return {
			id: "00000000-0000-0000-0000-000000000000",
			body:
				source === undefined
					? undefined
					: {
							source,
							created: "2026-04-17T00:00:00Z",
							updated: "2026-04-17T00:00:00Z",
							project_id: "00000000-0000-0000-0000-000000000000",
						},
		};
	}

	it("returns domain names for known ZenML sources", () => {
		const result = extractLogSources([
			mkResponse("step"),
			mkResponse("prepare_step"),
		]);
		expect(result).toEqual(["checkpoint", "prepare_checkpoint"]);
	});

	it("passes unknown sources through unchanged", () => {
		const result = extractLogSources([mkResponse("something_else")]);
		expect(result).toEqual(["something_else"]);
	});

	it("drops entries with missing or empty source", () => {
		const result = extractLogSources([
			mkResponse("step"),
			mkResponse(undefined),
			mkResponse(""),
		]);
		expect(result).toEqual(["checkpoint"]);
	});

	it("returns empty array for null/undefined collection", () => {
		expect(extractLogSources(null)).toEqual([]);
		expect(extractLogSources(undefined)).toEqual([]);
	});
});
