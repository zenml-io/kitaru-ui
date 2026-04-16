import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LogEntry } from "../domain/log-entry";
import { useLogLevelFilter } from "./use-log-level-filter";

function makeLog(level: number, message = "m"): LogEntry {
	return {
		id: String(Math.random()),
		message,
		level: level as LogEntry["level"],
		chunk_index: 0,
		total_chunks: 1,
		originalEntry: message,
	};
}

describe("useLogLevelFilter", () => {
	it("defaults to 'all' and returns every entry", () => {
		const logs = [
			makeLog(10, "debug"),
			makeLog(20, "info"),
			makeLog(40, "err"),
		];
		const { result } = renderHook(() => useLogLevelFilter(logs));
		expect(result.current.selectedLevel).toBe("all");
		expect(result.current.filteredLogs.map((l) => l.message)).toEqual([
			"debug",
			"info",
			"err",
		]);
	});

	it("hides lower levels when threshold is set above 'all'", () => {
		const logs = [
			makeLog(10, "debug"),
			makeLog(20, "info"),
			makeLog(40, "err"),
		];
		const { result } = renderHook(() => useLogLevelFilter(logs));
		act(() => result.current.setSelectedLevel(20));
		expect(result.current.filteredLogs.map((l) => l.message)).toEqual([
			"info",
			"err",
		]);
	});

	it("filters to level >= selectedLevel", () => {
		const logs = [makeLog(10), makeLog(20), makeLog(30), makeLog(40)];
		const { result } = renderHook(() => useLogLevelFilter(logs));
		act(() => result.current.setSelectedLevel(30));
		expect(result.current.filteredLogs.map((l) => l.level)).toEqual([30, 40]);
	});

	it("treats entries with null level as below any numeric threshold", () => {
		const bare: LogEntry = {
			id: "x",
			message: "bare",
			level: null,
			chunk_index: 0,
			total_chunks: 1,
			originalEntry: "bare",
		};
		const logs = [bare, makeLog(20, "info")];
		const { result } = renderHook(() => useLogLevelFilter(logs));
		act(() => result.current.setSelectedLevel(20));
		expect(result.current.filteredLogs.map((l) => l.message)).toEqual(["info"]);
	});
});
