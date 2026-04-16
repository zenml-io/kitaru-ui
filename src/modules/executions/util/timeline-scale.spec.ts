import { describe, expect, it } from "vitest";
import { computeTimelineWidths } from "./timeline-scale";

describe("computeTimelineWidths", () => {
	it("returns an empty array for empty input", () => {
		expect(computeTimelineWidths([])).toEqual([]);
	});

	it("returns [100] for a single duration", () => {
		expect(computeTimelineWidths([42])).toEqual([100]);
	});

	it("splits equal durations into equal widths summing to 100", () => {
		const widths = computeTimelineWidths([5, 5, 5, 5]);
		expect(widths).toHaveLength(4);
		for (const w of widths) {
			expect(w).toBeCloseTo(25, 9);
		}
		const sum = widths.reduce((a, b) => a + b, 0);
		expect(sum).toBeCloseTo(100, 9);
	});

	it("distributes width equally when every duration is zero", () => {
		const widths = computeTimelineWidths([0, 0, 0]);
		for (const w of widths) {
			expect(w).toBeCloseTo(100 / 3, 9);
		}
		const sum = widths.reduce((a, b) => a + b, 0);
		expect(sum).toBeCloseTo(100, 9);
	});

	it("scales widths by sqrt of duration ratio", () => {
		const [long, short] = computeTimelineWidths([300_000, 5_000]);
		expect(long / short).toBeCloseTo(Math.sqrt(300_000 / 5_000), 9);
	});

	it("produces the expected distribution for a long-plus-shorts mix", () => {
		const durations = [
			300_000, 1_000, 2_000, 3_000, 4_000, 5_000, 6_000, 7_000, 8_000, 9_000,
			10_000,
		];
		const widths = computeTimelineWidths(durations);

		const sum = widths.reduce((a, b) => a + b, 0);
		expect(sum).toBeCloseTo(100, 9);

		expect(widths[0]).toBeCloseTo(43.51, 1);
		expect(widths[10]).toBeCloseTo(7.95, 1);

		for (let i = 1; i < widths.length - 1; i++) {
			expect(widths[i + 1]).toBeGreaterThan(widths[i]);
		}
	});

	it("assigns zero width to zero durations while normalizing positives to 100", () => {
		const widths = computeTimelineWidths([0, 10_000, 0, 40_000]);
		expect(widths[0]).toBe(0);
		expect(widths[2]).toBe(0);
		const sum = widths.reduce((a, b) => a + b, 0);
		expect(sum).toBeCloseTo(100, 9);
		expect(widths[3] / widths[1]).toBeCloseTo(Math.sqrt(40_000 / 10_000), 9);
	});
});
