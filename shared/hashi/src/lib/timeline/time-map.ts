import type { ReactNode } from "react";
import type {
	TimelineGapTone,
	TimelineNode,
} from "@zenml/hashi/lib/timeline/types";

// Width of the fixed-size vertical stripe a collapsed pause renders as.
export const IDLE_GAP_PX = 24;

// A collapsed pause (a `collapsesToGap` node, e.g. a wait), rendered as a
// fixed-width stripe. Appearance comes from `tone`/`label`.
export interface IdleGap {
	startMs: number;
	endMs: number;
	durationMs: number;
	startPct: number;
	endPct: number;
	tone: TimelineGapTone;
	label?: string;
	description?: string;
	/** Optional custom tooltip content, supplied by the collapsed node. */
	tooltip?: ReactNode;
}

export interface TimeMap {
	totalMs: number;
	gaps: IdleGap[];
	msToPct: (ms: number) => number;
	pctToMs: (pct: number) => number;
}

interface Segment {
	startMs: number;
	endMs: number;
	startPct: number;
	endPct: number;
	kind: "active" | "idle";
}

type RawGap = Omit<IdleGap, "durationMs" | "startPct" | "endPct">;

/** Bare geometry of a compressible pause, for building a shared axis. */
export interface GapInterval {
	startMs: number;
	endMs: number;
}

// Back-to-back waits this close fold into one stripe so they don't render as
// two flush stripes. Only consecutive waits merge — never across a checkpoint.
const ADJACENT_TOLERANCE_MS = 1000;

// Gaps come only from nodes that opt to collapse into a stripe (waits). Idle
// time between nodes is NOT compressed — it renders as plain elapsed time.
// Consecutive waits fold into one stripe; a later wait wins its tone/label. A
// checkpoint between two waits breaks the run, so its bar is never swallowed —
// even a 1s one, which is exactly the merge tolerance.
function collectMergedGaps(nodes: TimelineNode[]): RawGap[] {
	const sorted = [...nodes].sort((a, b) => a.startMs - b.startMs);
	const merged: RawGap[] = [];
	let prevWasGap = false;
	for (const node of sorted) {
		if (!node.collapsesToGap) {
			prevWasGap = false;
			continue;
		}
		const gap: RawGap = {
			startMs: node.startMs,
			endMs: node.startMs + node.durationMs,
			tone: node.gapTone ?? "neutral",
			label: node.gapLabel,
			description: node.gapDescription,
			tooltip: node.tooltip,
		};
		const last = merged[merged.length - 1];
		if (
			prevWasGap &&
			last &&
			gap.startMs - last.endMs <= ADJACENT_TOLERANCE_MS
		) {
			last.endMs = Math.max(last.endMs, gap.endMs);
			last.tone = gap.tone;
			last.label = gap.label ?? last.label;
			last.description = gap.description ?? last.description;
			last.tooltip = gap.tooltip ?? last.tooltip;
		} else {
			merged.push(gap);
		}
		prevWasGap = true;
	}
	return merged;
}

/**
 * A timeline's compressible pause intervals, merged. The comparison view uses
 * these to build the shared prefix of its two-phase axis (see HybridSplit).
 */
export function collectGapIntervals(nodes: TimelineNode[]): GapInterval[] {
	return collectMergedGaps(nodes).map((g) => ({
		startMs: g.startMs,
		endMs: g.endMs,
	}));
}

function mergeIntervals(intervals: GapInterval[]): GapInterval[] {
	const sorted = intervals
		.filter((iv) => iv.endMs > iv.startMs)
		.sort((a, b) => a.startMs - b.startMs);
	const merged: GapInterval[] = [];
	for (const iv of sorted) {
		const last = merged[merged.length - 1];
		if (last && iv.startMs - last.endMs <= ADJACENT_TOLERANCE_MS) {
			last.endMs = Math.max(last.endMs, iv.endMs);
		} else {
			merged.push({ ...iv });
		}
	}
	return merged;
}

/**
 * Two-phase axis for a side-by-side comparison: a shared prefix up to
 * `boundaryMs` (identical for every compared timeline, so the fork line and
 * replayed checkpoints line up), then this timeline's own compression for the
 * divergent remainder (so its waits stay thin and its work stays visible).
 */
export interface HybridSplit {
	boundaryMs: number;
	/** Fraction of the width given to the shared prefix (0..1). */
	prefixFraction: number;
	/** Gaps compressing the shared prefix — identical for every timeline. */
	prefixGapIntervals: GapInterval[];
}

// Lay one span [startMs,endMs] into the pixel budget [startPx,endPx]: active
// time scales linearly, each gap takes a fixed idleGapPx. Percentages are
// relative to containerPx so several spans compose into a single axis.
function buildSegments(
	startMs: number,
	endMs: number,
	gapIntervals: GapInterval[],
	startPx: number,
	endPx: number,
	containerPx: number,
	idleGapPx: number
): Segment[] {
	const gaps = gapIntervals
		.map((g) => ({
			startMs: Math.max(g.startMs, startMs),
			endMs: Math.min(g.endMs, endMs),
		}))
		.filter((g) => g.endMs > g.startMs)
		.sort((a, b) => a.startMs - b.startMs);
	const totalIdleMs = gaps.reduce((sum, g) => sum + (g.endMs - g.startMs), 0);
	const activeMs = Math.max(endMs - startMs - totalIdleMs, 1);

	// Each gap normally renders as a fixed `idleGapPx` stripe. But with enough
	// non-merged gaps their combined fixed budget can exceed the pixel span — then
	// they can't all fit, so shrink every stripe uniformly to fit the span
	// (reserving 1px for active time when the span has any). Without this the
	// layout marches past `endPx`, pushing positions over 100% (NarrowGapOverflow).
	const spanPx = Math.max(endPx - startPx, 1);
	const activeReservePx = endMs - startMs > totalIdleMs ? 1 : 0;
	const maxGapPx = Math.max(spanPx - activeReservePx, 0);
	const gapPx =
		gaps.length > 0 && gaps.length * idleGapPx > maxGapPx
			? maxGapPx / gaps.length
			: idleGapPx;

	const totalGapPx = gaps.length * gapPx;
	const activePx = Math.max(endPx - startPx - totalGapPx, 1);
	const msPerPx = activeMs / activePx;
	const pct = (px: number) => (px / containerPx) * 100;

	const segments: Segment[] = [];
	let msCursor = startMs;
	let pxCursor = startPx;
	for (const gap of gaps) {
		if (gap.startMs > msCursor) {
			const segPx = (gap.startMs - msCursor) / msPerPx;
			segments.push({
				startMs: msCursor,
				endMs: gap.startMs,
				startPct: pct(pxCursor),
				endPct: pct(pxCursor + segPx),
				kind: "active",
			});
			pxCursor += segPx;
		}
		segments.push({
			startMs: gap.startMs,
			endMs: gap.endMs,
			startPct: pct(pxCursor),
			endPct: pct(pxCursor + gapPx),
			kind: "idle",
		});
		pxCursor += gapPx;
		msCursor = gap.endMs;
	}
	if (msCursor < endMs) {
		const segPx = (endMs - msCursor) / msPerPx;
		segments.push({
			startMs: msCursor,
			endMs: endMs,
			startPct: pct(pxCursor),
			endPct: pct(pxCursor + segPx),
			kind: "active",
		});
	}
	return segments;
}

// Order the pixel plan for one axis: an optional shared compressed prefix (for
// aligned comparison, up to `hybridSplit.boundaryMs`), this timeline's own
// compressed content, and — when this run is shorter than the shared axis — an
// empty linear tail out to the right edge. Single-execution timelines pass no
// hybridSplit and fill their natural extent, so only the middle span applies.
function planSegments(
	nodes: TimelineNode[],
	ownIntervals: GapInterval[],
	totalMs: number,
	containerPx: number,
	idleGapPx: number,
	hybridSplit?: HybridSplit
): Segment[] {
	const ownExtent = Math.min(
		nodes.reduce((max, n) => Math.max(max, n.startMs + n.durationMs), 0),
		totalMs
	);

	const hybrid =
		hybridSplit &&
		hybridSplit.boundaryMs > 0 &&
		hybridSplit.prefixFraction > 0 &&
		hybridSplit.boundaryMs < totalMs;
	const boundaryMs = hybrid ? hybridSplit.boundaryMs : 0;
	const prefixPx = hybrid
		? clamp(hybridSplit.prefixFraction, 0, 1) * containerPx
		: 0;

	// A run shorter than the axis ends sooner: its work compresses into a slice
	// of the remaining width proportional to how much of the elapsed span it
	// actually used, and the rest is a plain empty tail out to the shared right
	// edge (evenly spaced, so "1m 17s" still lands there).
	const doneTailFraction =
		ownExtent < totalMs && totalMs > boundaryMs
			? clamp((totalMs - ownExtent) / (totalMs - boundaryMs), 0, 0.9)
			: 0;
	const contentEndPx =
		prefixPx + (1 - doneTailFraction) * (containerPx - prefixPx);

	return [
		...(hybrid
			? buildSegments(
					0,
					boundaryMs,
					mergeIntervals(hybridSplit.prefixGapIntervals),
					0,
					prefixPx,
					containerPx,
					idleGapPx
				)
			: []),
		...buildSegments(
			boundaryMs,
			ownExtent,
			ownIntervals,
			prefixPx,
			contentEndPx,
			containerPx,
			idleGapPx
		),
		...(ownExtent < totalMs
			? buildSegments(
					ownExtent,
					totalMs,
					[],
					contentEndPx,
					containerPx,
					containerPx,
					idleGapPx
				)
			: []),
	];
}

export function buildTimeMap(
	nodes: TimelineNode[],
	totalMs: number,
	containerPx: number,
	idleGapPx = IDLE_GAP_PX,
	hybridSplit?: HybridSplit
): TimeMap {
	if (totalMs <= 0 || containerPx <= 0 || nodes.length === 0) {
		return { totalMs, gaps: [], msToPct: () => 0, pctToMs: () => 0 };
	}

	const mergedGaps = collectMergedGaps(nodes);
	const ownIntervals = mergedGaps.map((g) => ({
		startMs: g.startMs,
		endMs: g.endMs,
	}));

	const segments = planSegments(
		nodes,
		ownIntervals,
		totalMs,
		containerPx,
		idleGapPx,
		hybridSplit
	);

	const msToPct = (ms: number) => {
		const clamped = clamp(ms, 0, totalMs);
		for (const seg of segments) {
			if (clamped <= seg.endMs) {
				const span = Math.max(seg.endMs - seg.startMs, 1);
				const portion = (clamped - seg.startMs) / span;
				return seg.startPct + (seg.endPct - seg.startPct) * portion;
			}
		}
		return 100;
	};

	const pctToMs = (pct: number) => {
		const clamped = clamp(pct, 0, 100);
		for (const seg of segments) {
			if (clamped <= seg.endPct) {
				const span = Math.max(seg.endPct - seg.startPct, 0.0001);
				const portion = (clamped - seg.startPct) / span;
				return seg.startMs + (seg.endMs - seg.startMs) * portion;
			}
		}
		return totalMs;
	};

	return {
		totalMs,
		gaps: materializeGaps(mergedGaps, msToPct),
		msToPct,
		pctToMs,
	};
}

function materializeGaps(
	rawGaps: RawGap[],
	msToPct: (ms: number) => number
): IdleGap[] {
	return rawGaps.map((g) => ({
		startMs: g.startMs,
		endMs: g.endMs,
		durationMs: g.endMs - g.startMs,
		startPct: msToPct(g.startMs),
		endPct: msToPct(g.endMs),
		tone: g.tone,
		label: g.label,
		description: g.description,
		tooltip: g.tooltip,
	}));
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}
