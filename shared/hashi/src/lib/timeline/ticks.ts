import { formatDurationShort } from "@zenml/hashi/lib/format";
import type { TimeMap } from "@zenml/hashi/lib/timeline/time-map";

// 1/2/5 ladder of human-friendly tick intervals (ms).
const NICE_STEPS_MS = [
	1_000,
	2_000,
	5_000,
	10_000,
	15_000,
	30_000,
	60_000,
	2 * 60_000,
	5 * 60_000,
	10 * 60_000,
	15 * 60_000,
	30 * 60_000,
	60 * 60_000,
	2 * 60 * 60_000,
	6 * 60 * 60_000,
	12 * 60 * 60_000,
	24 * 60 * 60_000,
];

// Minimum horizontal distance (in px) between two adjacent tick centers.
// "12h 30m"-class labels in mono text-2xs are ~46px wide; 72px gives enough
// breathing room that adjacent labels never touch even at small viewports.
const MIN_TICK_GAP_PX = 72;

// Pick the smallest "nice" step at least `targetMs`, so tick density follows
// how much horizontal room a segment actually has — not the absolute time. A
// short active span keeps a fine step even at hour scale (e.g. the 5s of work
// after a one-hour wait still gets second-level ticks).
function pickNiceStep(targetMs: number): number {
	const required = Math.max(1, targetMs);
	return (
		NICE_STEPS_MS.find((s) => s >= required) ??
		NICE_STEPS_MS[NICE_STEPS_MS.length - 1]!
	);
}

// Axis labels reuse formatDurationShort, except a fine-grained tick at hour
// scale: formatDurationShort drops seconds past 1h, which would make adjacent
// second-apart ticks render identically. There, show h/m/s and trim only the
// leading/trailing zero units so an exact hour stays "1h", not "1h 0m 0s".
function formatAxisTick(ms: number, stepMs: number): string {
	if (ms < 3_600_000 || stepMs >= 60_000) return formatDurationShort(ms);
	const totalSec = Math.round(ms / 1000);
	const units: Array<[number, string]> = [
		[Math.floor(totalSec / 3600), "h"],
		[Math.floor((totalSec % 3600) / 60), "m"],
		[totalSec % 60, "s"],
	];
	let first = -1;
	let last = -1;
	units.forEach(([value], i) => {
		if (value > 0) {
			if (first < 0) first = i;
			last = i;
		}
	});
	if (first < 0) return "0s";
	return units
		.slice(first, last + 1)
		.map(([value, unit]) => `${value}${unit}`)
		.join(" ");
}

interface ActiveSegment {
	startMs: number;
	endMs: number;
}

function buildActiveSegments(timeMap: TimeMap): ActiveSegment[] {
	const segments: ActiveSegment[] = [];
	let cursor = 0;
	for (const gap of timeMap.gaps) {
		if (gap.startMs > cursor)
			segments.push({ startMs: cursor, endMs: gap.startMs });
		cursor = Math.max(cursor, gap.endMs);
	}
	if (cursor < timeMap.totalMs)
		segments.push({ startMs: cursor, endMs: timeMap.totalMs });
	return segments;
}

export interface TickMarker {
	pct: number;
	label: string;
	ms: number;
}

export function buildTicks(
	timeMap: TimeMap,
	containerWidth: number
): TickMarker[] {
	// Without a real container width we can't make responsive decisions; render
	// just the 0s anchor so the axis isn't empty during the first paint. The
	// useLayoutEffect re-measure happens in the same frame so the next render
	// (still pre-paint) has the proper width.
	if (containerWidth <= 0) {
		return [{ ms: 0, pct: timeMap.msToPct(0), label: "0s" }];
	}

	const segments = buildActiveSegments(timeMap);
	if (segments.length === 0) {
		return [{ ms: 0, pct: timeMap.msToPct(0), label: "0s" }];
	}

	// Wider than this px → use round-number nice-step ticks. Narrower (but
	// still ≥ MIN_TICK_GAP_PX) → fall back to "midpoint + exact end" so we
	// still anchor the user in time even where round numbers wouldn't fit.
	const COMPACT_SEGMENT_PX = MIN_TICK_GAP_PX * 3;

	const ticks: TickMarker[] = [];

	for (const seg of segments) {
		const segStart = seg.startMs;
		const segEnd = seg.endMs;
		const segDur = segEnd - segStart;
		if (segDur <= 0) continue;

		// How wide does this segment render in px? Time-map compression means a
		// 30s segment next to a 4h segment renders at roughly nothing — we must
		// skip nice ticks for it entirely or they'll overlap each other.
		const segStartPct = timeMap.msToPct(segStart);
		const segEndPct = timeMap.msToPct(segEnd);
		const segPxWidth = ((segEndPct - segStartPct) / 100) * containerWidth;

		if (segPxWidth < MIN_TICK_GAP_PX) {
			// Not enough room for even one labelled tick. Drop the segment from
			// the axis — the gap stripes on either side carry the visual cue.
			continue;
		}

		if (segPxWidth < COMPACT_SEGMENT_PX) {
			// Compacted segment: show the midpoint + the exact end. The round-
			// number picker would either yield zero ticks (if the segment doesn't
			// straddle a round boundary) or repeat the same label twice; the
			// midpoint + end gives a precise "you are here" instead.
			const midMs = (segStart + segEnd) / 2;
			ticks.push({
				ms: midMs,
				pct: timeMap.msToPct(midMs),
				label: formatAxisTick(midMs, segDur),
			});
			ticks.push({
				ms: segEnd,
				pct: segEndPct,
				label: formatAxisTick(segEnd, segDur),
			});
			continue;
		}

		// Target ~1 tick per MIN_TICK_GAP_PX of segment width.
		const maxTicks = Math.max(1, Math.floor(segPxWidth / MIN_TICK_GAP_PX));
		const targetStep = segDur / Math.max(1, maxTicks);
		const step = pickNiceStep(targetStep);

		// Lay ticks on a step grid anchored at 0 so `0s` always lands at the
		// origin.
		const firstTick = Math.ceil(segStart / step) * step;
		for (let ms = firstTick; ms <= segEnd; ms += step) {
			ticks.push({
				ms,
				pct: timeMap.msToPct(ms),
				label: formatAxisTick(ms, step),
			});
		}

		// Always label the segment's end. It's a wait's start time (or the axis
		// end), so labelling it keeps the compressed axis covered edge to edge and
		// makes the time "jump" across the next fixed-width wait stripe legible —
		// the round-number grid above usually stops short of it.
		if (ticks[ticks.length - 1]?.ms !== segEnd) {
			ticks.push({
				ms: segEnd,
				pct: Math.min(100, segEndPct),
				label: formatAxisTick(segEnd, step),
			});
		}
	}

	// Always anchor `0s` at the origin — natural step alignment usually
	// produces it but this guarantees a label even if the first segment was
	// too narrow for a regular tick.
	if (ticks.length === 0 || ticks[0]!.ms !== 0) {
		ticks.unshift({
			ms: 0,
			pct: timeMap.msToPct(0),
			label: formatAxisTick(0, 1000),
		});
	}

	// Always anchor the axis end so the right edge carries the total duration,
	// in both linear and compressed modes.
	if (ticks[ticks.length - 1]?.ms !== timeMap.totalMs) {
		ticks.push({
			ms: timeMap.totalMs,
			pct: Math.min(100, timeMap.msToPct(timeMap.totalMs)),
			label: formatAxisTick(timeMap.totalMs, 1000),
		});
	}

	// Final dedup pass: drop adjacent ticks that share a label string.
	// After segment-aware step picking this is mostly defensive — handles
	// edge cases where two segments end up with the same first labelled
	// tick after rounding (e.g. `4m` at the end of seg A and `4m` at the
	// start of seg B if they straddle a tiny gap).
	const dedupedByLabel: TickMarker[] = [];
	for (const t of ticks) {
		const prev = dedupedByLabel[dedupedByLabel.length - 1];
		if (prev && prev.label === t.label) continue;
		dedupedByLabel.push(t);
	}

	// Final px-distance pass: enforce MIN_TICK_GAP_PX globally even across
	// segment boundaries. Always preserve the very last tick by swapping it
	// in if it's too close to the previous keeper.
	const minPctGap = (MIN_TICK_GAP_PX / containerWidth) * 100;
	const filtered: TickMarker[] = [];
	for (let i = 0; i < dedupedByLabel.length; i++) {
		const t = dedupedByLabel[i]!;
		const isLast = i === dedupedByLabel.length - 1;
		const prev = filtered[filtered.length - 1];
		if (!prev) {
			filtered.push(t);
			continue;
		}
		if (isLast) {
			if (t.pct - prev.pct < minPctGap) filtered[filtered.length - 1] = t;
			else filtered.push(t);
			continue;
		}
		if (t.pct - prev.pct >= minPctGap) filtered.push(t);
	}

	return filtered;
}
