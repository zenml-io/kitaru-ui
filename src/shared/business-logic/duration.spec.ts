import { describe, expect, it } from "vitest";
import { getCanShowDuration } from "./duration";

const start = new Date("2024-01-01T00:00:00Z");
const end = new Date("2024-01-01T00:01:00Z");

describe("getCanShowDuration", () => {
	describe("active status", () => {
		it("returns true when startTime is set", () => {
			expect(getCanShowDuration({ status: "running", startTime: start })).toBe(
				true
			);
		});

		it("returns false when startTime is undefined", () => {
			expect(
				getCanShowDuration({ status: "running", startTime: undefined })
			).toBe(false);
		});

		it("ignores endTime and durationMs when active", () => {
			expect(
				getCanShowDuration({
					status: "initializing",
					startTime: undefined,
					endTime: end,
					durationMs: 5000,
				})
			).toBe(false);
		});
	});

	describe("inactive status", () => {
		it("returns true when startTime and endTime are both set", () => {
			expect(
				getCanShowDuration({
					status: "completed",
					startTime: start,
					endTime: end,
				})
			).toBe(true);
		});

		it("returns true when durationMs is positive", () => {
			expect(
				getCanShowDuration({
					status: "completed",
					startTime: undefined,
					durationMs: 5000,
				})
			).toBe(true);
		});

		it("returns false when durationMs is zero", () => {
			expect(
				getCanShowDuration({
					status: "completed",
					startTime: undefined,
					durationMs: 0,
				})
			).toBe(false);
		});

		it("returns false when only startTime is set (no endTime or durationMs)", () => {
			expect(
				getCanShowDuration({ status: "completed", startTime: start })
			).toBe(false);
		});

		it("returns false when status is undefined and no duration info is available", () => {
			expect(
				getCanShowDuration({ status: undefined, startTime: undefined })
			).toBe(false);
		});
	});
});
