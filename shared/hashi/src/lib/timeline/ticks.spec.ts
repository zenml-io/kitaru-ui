import { describe, expect, it } from "vitest";
import { buildTicks } from "./ticks";
import { buildTimeMap } from "./time-map";
import type { TimelineNode } from "./types";

function node(partial: Partial<TimelineNode> & { id: string }): TimelineNode {
	return {
		label: partial.id,
		startMs: 0,
		durationMs: 0,
		children: [],
		colorClass: "",
		...partial,
	};
}

// 10s work, a 60s wait, then 10s more work — the wait compresses to a fixed
// stripe, so the axis scale is non-uniform.
const nodes = [
	node({ id: "a", startMs: 0, durationMs: 10_000 }),
	node({
		id: "w",
		startMs: 10_000,
		durationMs: 60_000,
		collapsesToGap: true,
		gapTone: "warning",
	}),
	node({ id: "b", startMs: 70_000, durationMs: 10_000 }),
];

describe("buildTicks on a compressed axis", () => {
	const map = buildTimeMap(nodes, 80_000, 1000);
	const ticks = buildTicks(map, 1000);

	it("labels the right edge with the total duration (covers the whole axis)", () => {
		const last = ticks[ticks.length - 1]!;
		expect(last.ms).toBe(80_000);
		expect(last.pct).toBeCloseTo(100, 1);
	});

	it("labels the wait boundary so the compressed jump is legible", () => {
		expect(ticks.some((t) => t.ms === 10_000)).toBe(true);
	});

	it("keeps labels in ascending position with no duplicate strings", () => {
		for (let i = 1; i < ticks.length; i++) {
			expect(ticks[i]!.pct).toBeGreaterThanOrEqual(ticks[i - 1]!.pct);
			expect(ticks[i]!.label).not.toBe(ticks[i - 1]!.label);
		}
	});

	it("keeps every tick within the [0,100] pct range", () => {
		for (const t of ticks) {
			expect(t.pct).toBeGreaterThanOrEqual(0);
			expect(t.pct).toBeLessThanOrEqual(100);
		}
	});
});

const step = (id: string, startMs: number, durationMs: number): TimelineNode =>
	node({ id, startMs, durationMs });
const wait = (id: string, startMs: number, durationMs: number): TimelineNode =>
	node({ id, startMs, durationMs, collapsesToGap: true, gapTone: "warning" });

function ticksFor(ns: TimelineNode[], totalMs: number) {
	return buildTicks(buildTimeMap(ns, totalMs, 1000), 1000);
}

describe("buildTicks axis coverage edge cases", () => {
	it("labels the total even when the run ends on a wait", () => {
		const ticks = ticksFor(
			[step("a", 0, 5000), wait("w", 5000, 2 * 3_600_000)],
			2 * 3_600_000 + 5000
		);
		expect(ticks[ticks.length - 1]!.ms).toBe(2 * 3_600_000 + 5000);
	});

	it("covers the right edge across many interleaved waits", () => {
		const ns: TimelineNode[] = [];
		let cursor = 0;
		for (let i = 0; i < 6; i++) {
			ns.push(step(`s${i}`, cursor, 2000));
			cursor += 2000;
			ns.push(wait(`w${i}`, cursor, 60_000));
			cursor += 60_000;
		}
		const ticks = ticksFor(ns, cursor);
		expect(ticks[0]!.ms).toBe(0);
		expect(ticks[ticks.length - 1]!.ms).toBe(cursor);
		for (const t of ticks) {
			expect(t.pct).toBeGreaterThanOrEqual(0);
			expect(t.pct).toBeLessThanOrEqual(100);
		}
	});

	it("still anchors the origin for a single tiny checkpoint", () => {
		const ticks = ticksFor([step("only", 0, 200)], 200);
		expect(ticks[0]!.ms).toBe(0);
		expect(ticks[0]!.pct).toBeCloseTo(0, 1);
	});

	it("gives the post-wait region interior ticks at second resolution", () => {
		// load(1s) + propose(9s), a 1h wait, then run_engine(3s) + finalize(2s).
		// The 5s of work after the wait must get its own ticks — not just the
		// total at the far edge — with seconds shown despite the hour offset.
		const ticks = ticksFor(
			[
				step("a", 0, 1000),
				step("b", 1000, 9000),
				wait("w", 10_000, 3_600_000),
				step("c", 3_610_000, 3000),
				step("d", 3_613_000, 2000),
			],
			3_615_000
		);
		const postWait = ticks.filter((t) => t.ms > 3_610_000 && t.ms < 3_615_000);
		expect(postWait.length).toBeGreaterThanOrEqual(1);
		// Second-precise label at hour scale, e.g. "1h 0m 12s".
		expect(ticks.some((t) => /^\d+h .*\d+s$/.test(t.label))).toBe(true);
	});
});
