import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useLiveDurationMs } from "./use-live-duration-ms";

const start = new Date("2024-01-01T00:00:00Z");

const mockNow = { value: new Date("2024-01-01T00:01:00Z") };

vi.mock("./use-now", () => ({
	useNow: () => mockNow.value,
}));

describe("useLiveDurationMs", () => {
	describe("active status", () => {
		it("returns elapsed ms from startTime to now", () => {
			const { result } = renderHook(() =>
				useLiveDurationMs({ status: "running", startTime: start })
			);
			expect(result.current).toBe(mockNow.value.getTime() - start.getTime());
		});

		it("ignores durationMs in favour of now", () => {
			const { result } = renderHook(() =>
				useLiveDurationMs({
					status: "running",
					startTime: start,
					durationMs: 9999,
				})
			);
			expect(result.current).toBe(mockNow.value.getTime() - start.getTime());
		});

		it("returns undefined when startTime is missing", () => {
			const { result } = renderHook(() =>
				useLiveDurationMs({ status: "running", startTime: undefined })
			);
			expect(result.current).toBeUndefined();
		});

		it("returns undefined when elapsed is zero", () => {
			mockNow.value = start;
			const { result } = renderHook(() =>
				useLiveDurationMs({ status: "running", startTime: start })
			);
			expect(result.current).toBeUndefined();
			mockNow.value = new Date("2024-01-01T00:01:00Z");
		});

		it("updates duration as time advances", () => {
			mockNow.value = start;

			const { result, rerender } = renderHook(() =>
				useLiveDurationMs({ status: "running", startTime: start })
			);

			expect(result.current).toBeUndefined();

			act(() => {
				mockNow.value = new Date(start.getTime() + 3000);
				rerender();
			});

			expect(result.current).toBe(3000);

			mockNow.value = new Date("2024-01-01T00:01:00Z");
		});
	});

	describe("inactive status", () => {
		it("returns durationMs", () => {
			const { result } = renderHook(() =>
				useLiveDurationMs({ status: "completed", durationMs: 5000 })
			);
			expect(result.current).toBe(5000);
		});

		it("returns undefined when durationMs is zero or negative", () => {
			const { result } = renderHook(() =>
				useLiveDurationMs({ status: "completed", durationMs: 0 })
			);
			expect(result.current).toBeUndefined();
		});

		it("returns undefined when durationMs is missing", () => {
			const { result } = renderHook(() =>
				useLiveDurationMs({ status: "completed" })
			);
			expect(result.current).toBeUndefined();
		});

		it("returns undefined when status is undefined and no durationMs", () => {
			const { result } = renderHook(() =>
				useLiveDurationMs({ status: undefined })
			);
			expect(result.current).toBeUndefined();
		});
	});
});
