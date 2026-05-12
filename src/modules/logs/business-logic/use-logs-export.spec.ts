import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { downloadTextFile } from "@/shared/utils/download-file";
import { useLogsExport } from "./use-logs-export";

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

describe("useLogsExport", () => {
	it("downloads logs with the provided filename", () => {
		const { result } = renderHook(() =>
			useLogsExport({
				logs: [],
				downloadFilename: "checkpoint-cp-42.log",
			})
		);
		act(() => result.current.download());
		expect(downloadTextFile).toHaveBeenCalledWith(
			"checkpoint-cp-42.log",
			expect.any(String)
		);
	});

	it("copies a single row via the original entry", () => {
		const { result } = renderHook(() =>
			useLogsExport({
				logs: [],
				downloadFilename: "x.log",
			})
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
