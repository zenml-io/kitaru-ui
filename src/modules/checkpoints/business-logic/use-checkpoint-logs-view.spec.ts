import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { downloadTextFile } from "@/shared/utils/download-file";
import { useCheckpointLogsView } from "./use-checkpoint-logs-view";

vi.mock("./use-checkpoint-logs", () => ({
	useCheckpointLogs: vi.fn(() => ({ logs: [] })),
	getCheckpointLogsPollingInterval: vi.fn(() => false),
}));

vi.mock("@/shared/utils/download-file", () => ({
	downloadTextFile: vi.fn(),
}));

const writeText = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
	Object.assign(navigator, { clipboard: { writeText } });
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("useCheckpointLogsView", () => {
	it("falls back to the first available source when the default isn't in logSources", () => {
		const { result } = renderHook(() =>
			useCheckpointLogsView("cp-1", ["step"])
		);
		expect(result.current.selectedSource).toBe("step");
	});

	it("keeps the configured default when it's present in logSources", () => {
		const { result } = renderHook(() =>
			useCheckpointLogsView("cp-1", ["checkpoint", "step"])
		);
		expect(result.current.selectedSource).toBe("checkpoint");
	});

	it("clamps a user-selected source that is not in logSources", () => {
		const { result } = renderHook(() =>
			useCheckpointLogsView("cp-1", ["step"])
		);
		act(() => result.current.setSelectedSource("nonexistent"));
		expect(result.current.selectedSource).toBe("step");
	});

	it("updates the source when the new value is in logSources", () => {
		const { result } = renderHook(() =>
			useCheckpointLogsView("cp-1", ["checkpoint", "step"])
		);
		act(() => result.current.setSelectedSource("step"));
		expect(result.current.selectedSource).toBe("step");
	});

	it("downloads logs with a checkpoint-scoped filename", () => {
		const { result } = renderHook(() =>
			useCheckpointLogsView("cp-42", ["step"])
		);
		act(() => result.current.download());
		expect(downloadTextFile).toHaveBeenCalledWith(
			"checkpoint-cp-42.log",
			expect.any(String)
		);
	});

	it("copies a single row via the original entry", () => {
		const { result } = renderHook(() =>
			useCheckpointLogsView("cp-1", ["step"])
		);
		act(() =>
			result.current.copyRow({
				id: "0",
				message: "hello",
				level: 20,
				chunk_index: 0,
				total_chunks: 1,
				originalEntry: "RAW ENTRY",
			})
		);
		expect(writeText).toHaveBeenCalledWith("RAW ENTRY");
	});
});
