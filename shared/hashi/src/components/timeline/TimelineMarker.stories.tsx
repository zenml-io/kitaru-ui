import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { buildTimeMap } from "@zenml/hashi/lib/timeline/time-map";
import { timelineExtentMs } from "@zenml/hashi/lib/timeline/flatten-nodes";
import type { TimelineNode } from "@zenml/hashi/lib/timeline/types";
import { TimelineAxis } from "@zenml/hashi/components/timeline/TimelineAxis";
import { TimelineRow } from "@zenml/hashi/components/timeline/TimelineRow";

import { TIMELINE_NODES } from "../../storybook/fixtures";

import { TIMELINE_MARKER_LANE_HEIGHT, TimelineMarker } from "./TimelineMarker";

// ─── Fixtures ─────────────────────────────────────────────────────────────────
// The replay editor drives the marker over a flat checkpoint list. Flatten the
// shared tree to its top-level spans (dropping the collapsing `await_gpu`) so
// the marker snaps between real span starts.

const CHECKPOINTS: TimelineNode[] = TIMELINE_NODES.filter(
	(n) => !n.collapsesToGap
).map((n) => ({ ...n, expanded: false, children: [] }));

// Geometry shared with the rows so the marker rail lines up with the bars.
const NAME_COL_WIDTH = 248;
const LEFT_PAD = 6;
const RIGHT_PAD = 80;
const TRACK_PX = 1100;

const TIME_MAP = buildTimeMap(
	CHECKPOINTS,
	timelineExtentMs(CHECKPOINTS),
	TRACK_PX
);

// ─── Scene ────────────────────────────────────────────────────────────────────
// Reproduces the replay editor: an axis header, a grip-lane spacer, the real
// timeline rows, and the marker overlaying them as the last child of a single
// `relative` container. Dragging (or the arrow keys) snaps the start to the
// nearest checkpoint.

function MarkerScene({
	initialId,
	label,
}: {
	initialId: string;
	label?: React.ReactNode;
}) {
	const [startId, setStartId] = React.useState(initialId);
	const [selectedId, setSelectedId] = React.useState<string | null>(null);

	const startRow = CHECKPOINTS.find((c) => c.id === startId) ?? CHECKPOINTS[0]!;
	const startPct = TIME_MAP.msToPct(startRow.startMs);

	const snapToNearest = (pct: number) => {
		const ms = TIME_MAP.pctToMs(pct);
		let best = CHECKPOINTS[0]!;
		let bestDist = Infinity;
		for (const c of CHECKPOINTS) {
			const d = Math.abs(c.startMs - ms);
			if (d < bestDist) {
				bestDist = d;
				best = c;
			}
		}
		if (best.id !== startId) setStartId(best.id);
	};

	const step = (delta: -1 | 1) => {
		const idx = CHECKPOINTS.findIndex((c) => c.id === startId);
		const next =
			CHECKPOINTS[Math.max(0, Math.min(CHECKPOINTS.length - 1, idx + delta))];
		if (next && next.id !== startId) setStartId(next.id);
	};

	return (
		<div className="border-border bg-background w-[900px] max-w-full overflow-hidden rounded-lg border">
			<div className="border-border flex items-stretch border-b">
				<div
					className="border-border text-muted-foreground flex shrink-0 items-center border-r px-4 text-xs font-medium"
					style={{ width: NAME_COL_WIDTH }}
				>
					Checkpoint
				</div>
				<div className="relative flex-1 py-2">
					<TimelineAxis
						timeMap={TIME_MAP}
						leftPadPx={LEFT_PAD}
						rightPadPx={RIGHT_PAD}
					/>
				</div>
			</div>

			<div className="relative">
				<div style={{ height: TIMELINE_MARKER_LANE_HEIGHT }} />
				{CHECKPOINTS.map((node) => (
					<TimelineRow
						key={node.id}
						node={node}
						depth={0}
						isSelected={selectedId === node.id}
						onSelect={setSelectedId}
						hasChildren={false}
						nameColWidth={NAME_COL_WIDTH}
						timeMap={TIME_MAP}
						rightPadPx={RIGHT_PAD}
						leftPadPx={LEFT_PAD}
					/>
				))}
				<TimelineMarker
					positionPct={startPct}
					ariaLabel={`Replay start at ${startRow.label}. Use the arrow keys to move it.`}
					label={label}
					leftInsetPx={NAME_COL_WIDTH + LEFT_PAD}
					rightInsetPx={RIGHT_PAD}
					onDrag={snapToNearest}
					onStep={step}
					onHome={() => setStartId(CHECKPOINTS[0]!.id)}
					onEnd={() => setStartId(CHECKPOINTS[CHECKPOINTS.length - 1]!.id)}
				/>
			</div>

			<div className="text-muted-foreground border-border border-t px-4 py-2 text-xs">
				Drag the handle, or focus it and use the arrow keys, to set where the
				replay starts.
			</div>
		</div>
	);
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * `TimelineMarker` is a generic draggable position marker for timeline
 * surfaces: a grip button in a top lane plus a dashed vertical line spanning the
 * rows below. It is percentage-controlled — the host owns `positionPct` and all
 * snapping — and reports raw rail percentages on drag (`onDrag`) while
 * delegating keyboard moves via `onStep` / `onHome` / `onEnd`. The grip is a
 * labelled button, not a slider, so it announces its position through
 * `ariaLabel` and moves with the arrow keys.
 *
 * The replay editor uses it to pick where a re-run begins; these stories wire it
 * to snap to the nearest span start.
 */
const meta: Meta<typeof TimelineMarker> = {
	title: "Components/Timeline/TimelineMarker",
	component: TimelineMarker,
	parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof TimelineMarker>;

// ─── Default (start of trace) ─────────────────────────────────────────────────

export const Default: Story = {
	render: () => <MarkerScene initialId="ingest_documents" label="Start here" />,
};

// ─── Parked mid-rail ──────────────────────────────────────────────────────────
// The marker at a later checkpoint — where a replay would reuse everything
// before it and re-run from here on.

export const StartsMidway: Story = {
	render: () => <MarkerScene initialId="train_classifier" label="Start here" />,
};

// ─── Icon-only grip ───────────────────────────────────────────────────────────
// `label` is optional; omit it for a compact grip that shows only the handle
// icon. The full sentence still lives on `ariaLabel`.

export const WithoutLabel: Story = {
	render: () => <MarkerScene initialId="evaluate_model" />,
};
