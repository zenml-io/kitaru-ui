import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCheckpointLogSource } from "./use-checkpoint-log-source";

describe("useCheckpointLogSource", () => {
	it("falls back to the first available source when the default isn't in logSources", () => {
		const { result } = renderHook(() => useCheckpointLogSource(["step"]));
		expect(result.current.selectedSource).toBe("step");
	});

	it("keeps the configured default when it's present in logSources", () => {
		const { result } = renderHook(() =>
			useCheckpointLogSource(["checkpoint", "step"])
		);
		expect(result.current.selectedSource).toBe("checkpoint");
	});

	it("clamps a user-selected source that is not in logSources", () => {
		const { result } = renderHook(() => useCheckpointLogSource(["step"]));
		act(() => result.current.setSelectedSource("nonexistent"));
		expect(result.current.selectedSource).toBe("step");
	});

	it("updates the source when the new value is in logSources", () => {
		const { result } = renderHook(() =>
			useCheckpointLogSource(["checkpoint", "step"])
		);
		act(() => result.current.setSelectedSource("step"));
		expect(result.current.selectedSource).toBe("step");
	});
});
