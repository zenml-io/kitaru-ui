import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LogEntry } from "../domain/log-entry";
import { useLogSearch } from "./use-log-search";

function makeLog(message: string): LogEntry {
	return {
		id: message,
		message,
		level: 20,
		chunk_index: 0,
		total_chunks: 1,
		originalEntry: message,
	};
}

describe("useLogSearch", () => {
	it("returns zero matches when search is empty", () => {
		const logs = [makeLog("hello world")];
		const { result } = renderHook(() => useLogSearch(logs));
		expect(result.current.matchCount).toBe(0);
		expect(result.current.activeMatchIndex).toBe(-1);
		expect(result.current.matchesByLogIndex.size).toBe(0);
	});

	it("finds a single match in one entry", () => {
		const logs = [makeLog("hello world")];
		const { result } = renderHook(() => useLogSearch(logs));
		act(() => result.current.setSearch("world"));
		expect(result.current.matchCount).toBe(1);
		expect(result.current.activeMatchIndex).toBe(0);
		expect(result.current.matchesByLogIndex.get(0)).toEqual([
			{ start: 6, end: 11 },
		]);
	});

	it("is case-insensitive", () => {
		const logs = [makeLog("HELLO World")];
		const { result } = renderHook(() => useLogSearch(logs));
		act(() => result.current.setSearch("hello"));
		expect(result.current.matchCount).toBe(1);
	});

	it("finds multiple matches across entries", () => {
		const logs = [makeLog("foo bar"), makeLog("baz foo"), makeLog("foo foo")];
		const { result } = renderHook(() => useLogSearch(logs));
		act(() => result.current.setSearch("foo"));
		expect(result.current.matchCount).toBe(4);
	});

	it("nextMatch cycles forward and wraps", () => {
		const logs = [makeLog("foo"), makeLog("foo"), makeLog("foo")];
		const { result } = renderHook(() => useLogSearch(logs));
		act(() => result.current.setSearch("foo"));
		expect(result.current.activeMatchIndex).toBe(0);
		act(() => result.current.nextMatch());
		expect(result.current.activeMatchIndex).toBe(1);
		act(() => result.current.nextMatch());
		expect(result.current.activeMatchIndex).toBe(2);
		act(() => result.current.nextMatch());
		expect(result.current.activeMatchIndex).toBe(0);
	});

	it("prevMatch cycles backward and wraps", () => {
		const logs = [makeLog("foo"), makeLog("foo"), makeLog("foo")];
		const { result } = renderHook(() => useLogSearch(logs));
		act(() => result.current.setSearch("foo"));
		act(() => result.current.prevMatch());
		expect(result.current.activeMatchIndex).toBe(2);
		act(() => result.current.prevMatch());
		expect(result.current.activeMatchIndex).toBe(1);
	});

	it("resets activeMatchIndex when search changes", () => {
		const logs = [makeLog("foo"), makeLog("foo")];
		const { result } = renderHook(() => useLogSearch(logs));
		act(() => result.current.setSearch("foo"));
		act(() => result.current.nextMatch());
		expect(result.current.activeMatchIndex).toBe(1);
		act(() => result.current.setSearch("f"));
		expect(result.current.activeMatchIndex).toBe(0);
	});

	it("exposes the active match with logIndex and range", () => {
		const logs = [makeLog("aaa"), makeLog("aaa")];
		const { result } = renderHook(() => useLogSearch(logs));
		act(() => result.current.setSearch("a"));
		expect(result.current.activeMatch).toEqual({
			logIndex: 0,
			range: { start: 0, end: 1 },
		});
	});

	it("clamps to end of matches when logs shrink below active index", () => {
		const logs = [makeLog("foo"), makeLog("foo"), makeLog("foo")];
		const { result, rerender } = renderHook(
			({ logs }: { logs: LogEntry[] }) => useLogSearch(logs),
			{ initialProps: { logs } }
		);
		act(() => result.current.setSearch("foo"));
		act(() => result.current.nextMatch());
		act(() => result.current.nextMatch());
		expect(result.current.activeMatchIndex).toBe(2);

		rerender({ logs: [makeLog("foo")] });
		expect(result.current.matchCount).toBe(1);
		expect(result.current.activeMatchIndex).toBe(0);

		act(() => result.current.nextMatch());
		expect(result.current.activeMatchIndex).toBe(0);
	});

	it("prevMatch from a clamped index goes to the new last match", () => {
		const logs = [makeLog("foo"), makeLog("foo"), makeLog("foo")];
		const { result, rerender } = renderHook(
			({ logs }: { logs: LogEntry[] }) => useLogSearch(logs),
			{ initialProps: { logs } }
		);
		act(() => result.current.setSearch("foo"));
		act(() => result.current.nextMatch());
		act(() => result.current.nextMatch());
		expect(result.current.activeMatchIndex).toBe(2);

		rerender({ logs: [makeLog("foo"), makeLog("foo")] });
		expect(result.current.matchCount).toBe(2);
		expect(result.current.activeMatchIndex).toBe(1);

		act(() => result.current.prevMatch());
		expect(result.current.activeMatchIndex).toBe(0);
	});
});
