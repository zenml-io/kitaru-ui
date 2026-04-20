import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useLogSource } from "./use-log-source";

describe("useLogSource", () => {
	it("falls back to the first available source when the default isn't in logSources", () => {
		const { result } = renderHook(() => useLogSource(["step"], "checkpoint"));
		expect(result.current.selectedSource).toBe("step");
	});

	it("keeps the configured default when it's present in logSources", () => {
		const { result } = renderHook(() =>
			useLogSource(["checkpoint", "step"], "checkpoint")
		);
		expect(result.current.selectedSource).toBe("checkpoint");
	});

	it("clamps a user-selected source that is not in logSources", () => {
		const { result } = renderHook(() => useLogSource(["step"], "checkpoint"));
		act(() => result.current.setSelectedSource("nonexistent"));
		expect(result.current.selectedSource).toBe("step");
	});

	it("updates the source when the new value is in logSources", () => {
		const { result } = renderHook(() =>
			useLogSource(["checkpoint", "step"], "checkpoint")
		);
		act(() => result.current.setSelectedSource("step"));
		expect(result.current.selectedSource).toBe("step");
	});
});
