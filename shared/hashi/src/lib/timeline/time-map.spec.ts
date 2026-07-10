import { describe, expect, it } from "vitest";
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

const wait = (id: string, startMs: number, durationMs: number) =>
	node({ id, startMs, durationMs, collapsesToGap: true, gapTone: "warning" });
const step = (id: string, startMs: number, durationMs: number) =>
	node({ id, startMs, durationMs });

const nodes = [
	step("a", 0, 1000),
	wait("w", 1000, 60_000),
	step("b", 61_000, 1000),
];

const compressed = (ns: TimelineNode[], totalMs: number) =>
	buildTimeMap(ns, totalMs, 1000);

describe("buildTimeMap compressed wait width", () => {
	it("collapses a long wait to a fixed-width stripe, not a proportional band", () => {
		// A 60s wait inside a 63s timeline would be ~95% of the axis if scaled
		// to real time; compressed it must be a thin fixed stripe so the
		// surrounding work stays visible.
		const map = compressed(nodes, 63_000);
		const [gap] = map.gaps;
		expect(gap.endPct - gap.startPct).toBeLessThan(5);
	});

	it("keeps the stripe fixed-width regardless of how long the wait is", () => {
		const short = compressed(
			[step("a", 0, 1000), wait("w", 1000, 5000), step("b", 6000, 1000)],
			7000
		);
		const long = compressed(
			[step("a", 0, 1000), wait("w", 1000, 6 * 3_600_000), step("b", 0, 1000)],
			6 * 3_600_000 + 2000
		);
		const w = (m: ReturnType<typeof buildTimeMap>) =>
			m.gaps[0]!.endPct - m.gaps[0]!.startPct;
		// A 5s and a 6h wait render at the same stripe width.
		expect(w(short)).toBeCloseTo(w(long), 5);
	});
});

describe("buildTimeMap gap detection edge cases", () => {
	it("collapses a wait at the very start", () => {
		const map = compressed(
			[wait("w", 0, 60_000), step("a", 60_000, 1000)],
			61_000
		);
		expect(map.gaps).toHaveLength(1);
		expect(map.gaps[0]!.startMs).toBe(0);
	});

	it("collapses a wait at the very end", () => {
		const map = compressed(
			[step("a", 0, 1000), wait("w", 1000, 60_000)],
			61_000
		);
		expect(map.gaps).toHaveLength(1);
		expect(map.gaps[0]!.endMs).toBe(61_000);
	});

	it("merges back-to-back waits into a single stripe", () => {
		const map = compressed(
			[
				step("a", 0, 1000),
				wait("w1", 1000, 30_000),
				wait("w2", 31_000, 30_000),
				step("b", 61_000, 1000),
			],
			62_000
		);
		expect(map.gaps).toHaveLength(1);
		expect(map.gaps[0]!.startMs).toBe(1000);
		expect(map.gaps[0]!.endMs).toBe(61_000);
	});

	it("keeps a wait on each side of a 1s checkpoint (never swallows it)", () => {
		// The 1s checkpoint equals the merge tolerance; the flanking waits must
		// stay two separate stripes so its bar isn't drawn inside one.
		const map = compressed(
			[
				step("a", 0, 1000),
				wait("w1", 1000, 30_000),
				step("mid", 31_000, 1000),
				wait("w2", 32_000, 30_000),
				step("b", 62_000, 1000),
			],
			63_000
		);
		expect(map.gaps).toHaveLength(2);
	});

	it("does not compress idle time between steps — only waits collapse", () => {
		// A 5min gap between two checkpoints with no wait node renders as plain
		// elapsed time; it is not collapsed into a stripe.
		const map = compressed(
			[step("a", 0, 1000), step("b", 301_000, 1000)],
			302_000
		);
		expect(map.gaps).toHaveLength(0);
	});
});

describe("buildTimeMap degenerate inputs", () => {
	it("returns an empty map for no nodes", () => {
		const map = compressed([], 1000);
		expect(map.gaps).toHaveLength(0);
		expect(map.msToPct(500)).toBe(0);
	});

	it("handles a single zero-duration checkpoint without NaN positions", () => {
		const map = compressed([step("only", 0, 0)], 1);
		expect(Number.isFinite(map.msToPct(0))).toBe(true);
		expect(map.gaps).toHaveLength(0);
	});

	it("keeps all positions within [0,100] with zero-duration checkpoints", () => {
		const map = compressed(
			[step("a", 0, 0), step("b", 0, 5000), step("c", 5000, 0)],
			5000
		);
		for (const ms of [0, 2500, 5000]) {
			const pct = map.msToPct(ms);
			expect(pct).toBeGreaterThanOrEqual(0);
			expect(pct).toBeLessThanOrEqual(100);
		}
	});
});

describe("buildTimeMap hybrid split (comparison)", () => {
	// Two timelines sharing a replayed prefix [0,10s] but diverging after. With
	// the same hybrid split, the shared prefix maps identically (so the fork
	// line and replayed checkpoints line up); the tails compress independently.
	const split = {
		boundaryMs: 10_000,
		prefixFraction: 0.5,
		prefixGapIntervals: [],
	};
	const A = [
		step("a", 0, 10_000),
		wait("aw", 10_000, 60_000),
		step("a2", 70_000, 10_000),
	];
	const B = [
		step("a", 0, 10_000),
		wait("bw", 10_000, 20_000),
		step("b2", 30_000, 10_000),
	];

	it("maps the shared prefix (incl. the fork point) identically", () => {
		const mapA = buildTimeMap(A, 80_000, 1000, undefined, split);
		const mapB = buildTimeMap(B, 80_000, 1000, undefined, split);
		for (const ms of [0, 2_500, 5_000, 10_000]) {
			expect(mapA.msToPct(ms)).toBeCloseTo(mapB.msToPct(ms), 6);
		}
		// Boundary lands at the prefix fraction.
		expect(mapA.msToPct(10_000)).toBeCloseTo(50, 4);
	});

	it("compresses each timeline's own tail waits to a thin stripe", () => {
		const mapA = buildTimeMap(A, 80_000, 1000, undefined, split);
		const [gap] = mapA.gaps; // the 60s wait in A's tail
		expect(gap!.endPct - gap!.startPct).toBeLessThan(15);
	});

	it("ends a shorter run early, leaving an evenly-spaced empty tail", () => {
		// B finishes at 40s of the 80s axis: its work sits left of the edge, and
		// the remainder is a plain linear tail that still reaches 100%.
		const mapB = buildTimeMap(B, 80_000, 1000, undefined, split);
		expect(mapB.msToPct(40_000)).toBeLessThan(90);
		expect(mapB.msToPct(80_000)).toBeCloseTo(100, 4);
		// Equal time steps in the tail map to equal distance (evenly spaced).
		const stepA = mapB.msToPct(60_000) - mapB.msToPct(50_000);
		const stepB = mapB.msToPct(70_000) - mapB.msToPct(60_000);
		expect(stepA).toBeCloseTo(stepB, 4);
	});
});

describe("buildTimeMap gap-budget overflow (narrow container)", () => {
	// N waits, each split by a checkpoint so they don't merge — every wait is a
	// distinct fixed-width stripe. When N * IDLE_GAP_PX exceeds the container the
	// stripes must shrink to fit, never pushing positions past 100%.
	const separatedWaits = (n: number) => {
		const ns: TimelineNode[] = [];
		let t = 0;
		for (let i = 0; i < n; i++) {
			ns.push(wait(`w${i}`, t, 5000));
			t += 5000;
			ns.push(step(`c${i}`, t, 1000));
			t += 1000;
		}
		return { nodes: ns, totalMs: t };
	};

	// The exact cases from the PR #229 review (13/20 @ 300px used to overflow).
	for (const [n, px] of [
		[8, 300],
		[13, 300],
		[20, 300],
		[40, 160],
	] as const) {
		it(`keeps every position within [0,100] for ${n} waits @ ${px}px`, () => {
			const { nodes: ns, totalMs } = separatedWaits(n);
			const map = buildTimeMap(ns, totalMs, px);
			expect(map.msToPct(totalMs)).toBeLessThanOrEqual(100.01);
			for (const gap of map.gaps) {
				expect(gap.startPct).toBeGreaterThanOrEqual(0);
				expect(gap.endPct).toBeLessThanOrEqual(100.01);
			}
		});
	}

	it("still renders fixed-width stripes when they comfortably fit", () => {
		// 3 waits at 800px: budget (72px) << width, so no shrinking — the stripe
		// stays the full IDLE_GAP_PX and the right edge lands exactly at 100%.
		const { nodes: ns, totalMs } = separatedWaits(3);
		const map = buildTimeMap(ns, totalMs, 800);
		expect(map.msToPct(totalMs)).toBeCloseTo(100, 4);
		const [gap] = map.gaps;
		expect((gap!.endPct - gap!.startPct) * 8).toBeCloseTo(24, 1); // 24px of 800
	});
});
