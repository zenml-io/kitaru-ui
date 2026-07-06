import type { ReactNode } from "react";
import type {
	TimelineGapTone,
	TimelineNode,
} from "@zenml/hashi/lib/timeline/types";

// Any empty span of time between nodes longer than this collapses into a
// fixed-width vertical pause stripe, so a long idle period doesn't blow out the
// horizontal axis with whitespace.
export const IDLE_THRESHOLD_MS = 30 * 1000;
export const IDLE_GAP_PX = 24;

// "idle" = engine-detected empty time between nodes; "marked" = a host node
// that opted to render as a stripe (collapsesToGap). Structural only — the
// stripe's appearance comes from `tone`/`label`, not `kind`.
export type GapKind = "idle" | "marked";

export interface IdleGap {
	startMs: number;
	endMs: number;
	durationMs: number;
	startPct: number;
	endPct: number;
	kind: GapKind;
	tone: TimelineGapTone;
	label?: string;
	description?: string;
	/** Optional custom tooltip content, supplied by the collapsed node. */
	tooltip?: ReactNode;
}

export interface TimeMap {
	totalMs: number;
	gaps: IdleGap[];
	scaleMode: TimelineScaleMode;
	msToPct: (ms: number) => number;
	pctToMs: (pct: number) => number;
}

export type TimelineScaleMode = "compressed" | "linear";

interface Segment {
	startMs: number;
	endMs: number;
	startPct: number;
	endPct: number;
	kind: "active" | "idle";
}

type RawGap = Omit<IdleGap, "durationMs" | "startPct" | "endPct">;

export function buildTimeMap(
	nodes: TimelineNode[],
	totalMs: number,
	containerPx: number,
	idleThresholdMs = IDLE_THRESHOLD_MS,
	idleGapPx = IDLE_GAP_PX,
	scaleMode: TimelineScaleMode = "compressed"
): TimeMap {
	if (totalMs <= 0 || containerPx <= 0 || nodes.length === 0) {
		return {
			totalMs,
			gaps: [],
			scaleMode,
			msToPct: () => 0,
			pctToMs: () => 0,
		};
	}

	const sorted = [...nodes].sort((a, b) => a.startMs - b.startMs);
	// Two sources of gaps: (1) idle time between nodes exceeding the threshold,
	// and (2) nodes that opted to collapse into a stripe — both are non-"active"
	// pauses, collapsed into compact vertical-bar stripes the same way.
	const rawGaps: RawGap[] = [];
	let cursor = 0;
	for (const node of sorted) {
		const end = node.startMs + node.durationMs;
		if (node.startMs - cursor >= idleThresholdMs) {
			rawGaps.push({
				startMs: cursor,
				endMs: node.startMs,
				kind: "idle",
				tone: "neutral",
			});
		}
		if (node.collapsesToGap) {
			rawGaps.push({
				startMs: node.startMs,
				endMs: end,
				kind: "marked",
				tone: node.gapTone ?? "neutral",
				label: node.gapLabel,
				description: node.gapDescription,
				tooltip: node.tooltip,
			});
		}
		cursor = Math.max(cursor, end);
	}

	// Merge any two raw gaps that are temporally adjacent (or near-adjacent).
	// Without this, a marked gap that starts right after an idle period produces
	// two flush 24px stripes that visually overlap. A marked gap wins so the
	// merged stripe keeps the host's tone/label and its tooltip description.
	const ADJACENT_TOLERANCE_MS = 1000;
	const mergedGaps: typeof rawGaps = [];
	for (const gap of rawGaps) {
		const last = mergedGaps[mergedGaps.length - 1];
		if (last && gap.startMs - last.endMs <= ADJACENT_TOLERANCE_MS) {
			last.endMs = Math.max(last.endMs, gap.endMs);
			if (gap.kind === "marked") {
				last.kind = "marked";
				last.tone = gap.tone;
				last.label = gap.label ?? last.label;
				last.description = gap.description ?? last.description;
				last.tooltip = gap.tooltip ?? last.tooltip;
			}
		} else {
			mergedGaps.push({ ...gap });
		}
	}

	if (scaleMode === "linear") return buildLinearTimeMap(totalMs, mergedGaps);

	if (mergedGaps.length === 0) {
		return buildLinearTimeMap(totalMs, [], scaleMode);
	}

	const totalIdleMs = mergedGaps.reduce(
		(sum, g) => sum + (g.endMs - g.startMs),
		0
	);
	const activeMs = Math.max(totalMs - totalIdleMs, 1);
	const totalGapPx = mergedGaps.length * idleGapPx;
	const activePx = Math.max(containerPx - totalGapPx, 1);
	const msPerPx = activeMs / activePx;
	const effectivePx = activePx + totalGapPx;

	const segments: Segment[] = [];
	let msCursor = 0;
	let pxCursor = 0;
	for (const gap of mergedGaps) {
		if (gap.startMs > msCursor) {
			const segMs = gap.startMs - msCursor;
			const segPx = segMs / msPerPx;
			segments.push({
				startMs: msCursor,
				endMs: gap.startMs,
				startPct: (pxCursor / effectivePx) * 100,
				endPct: ((pxCursor + segPx) / effectivePx) * 100,
				kind: "active",
			});
			pxCursor += segPx;
		}
		segments.push({
			startMs: gap.startMs,
			endMs: gap.endMs,
			startPct: (pxCursor / effectivePx) * 100,
			endPct: ((pxCursor + idleGapPx) / effectivePx) * 100,
			kind: "idle",
		});
		pxCursor += idleGapPx;
		msCursor = gap.endMs;
	}
	if (msCursor < totalMs) {
		const segMs = totalMs - msCursor;
		const segPx = segMs / msPerPx;
		segments.push({
			startMs: msCursor,
			endMs: totalMs,
			startPct: (pxCursor / effectivePx) * 100,
			endPct: ((pxCursor + segPx) / effectivePx) * 100,
			kind: "active",
		});
	}

	const msToPct = (ms: number) => {
		const clamped = clamp(ms, 0, totalMs);
		for (const seg of segments) {
			if (clamped <= seg.endMs) {
				if (seg.kind === "idle") {
					const gapPortion =
						(clamped - seg.startMs) / Math.max(seg.endMs - seg.startMs, 1);
					return seg.startPct + (seg.endPct - seg.startPct) * gapPortion;
				}
				const segMs = Math.max(seg.endMs - seg.startMs, 1);
				const portion = (clamped - seg.startMs) / segMs;
				return seg.startPct + (seg.endPct - seg.startPct) * portion;
			}
		}
		return 100;
	};

	const pctToMs = (pct: number) => {
		const clamped = clamp(pct, 0, 100);
		for (const seg of segments) {
			if (clamped <= seg.endPct) {
				const segPct = Math.max(seg.endPct - seg.startPct, 0.0001);
				const portion = (clamped - seg.startPct) / segPct;
				return seg.startMs + (seg.endMs - seg.startMs) * portion;
			}
		}
		return totalMs;
	};

	const gaps = materializeGaps(mergedGaps, msToPct);

	return { totalMs, gaps, scaleMode, msToPct, pctToMs };
}

function buildLinearTimeMap(
	totalMs: number,
	rawGaps: RawGap[],
	scaleMode: TimelineScaleMode = "linear"
): TimeMap {
	const msToPct = (ms: number) => clamp01((ms / totalMs) * 100);
	const pctToMs = (pct: number) => clamp(pct / 100, 0, 1) * totalMs;

	return {
		totalMs,
		gaps: materializeGaps(rawGaps, msToPct),
		scaleMode,
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
		kind: g.kind,
		tone: g.tone,
		label: g.label,
		description: g.description,
		tooltip: g.tooltip,
	}));
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

function clamp01(value: number) {
	return clamp(value, 0, 100);
}
