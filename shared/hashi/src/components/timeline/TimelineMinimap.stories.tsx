import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { buildTimeMap } from "@zenml/hashi/lib/timeline/time-map";
import {
	flattenNodes,
	timelineExtentMs,
} from "@zenml/hashi/lib/timeline/flatten-nodes";
import type { TimeMap } from "@zenml/hashi/lib/timeline/time-map";
import type { TimelineNode } from "@zenml/hashi/lib/timeline/types";

import { DENSE_TIMELINE_NODES, TIMELINE_NODES } from "../../storybook/fixtures";

import { TimelineMinimap } from "./TimelineMinimap";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const NAME_COL_WIDTH = 220;
const TRACK_PX = 1100;

// Shared trace: same rows/timeMap the waterfall feeds the minimap (the
// collapsing gap node is dropped, matching the waterfall's row set).
const TIME_MAP = buildTimeMap(
	TIMELINE_NODES,
	timelineExtentMs(TIMELINE_NODES),
	TRACK_PX
);
const ROWS = flattenNodes(TIMELINE_NODES).filter(
	({ node }) => !node.collapsesToGap
);

// The shared dense trace (120 spans) — beyond ~37 rows the minimap compresses
// its bar pitch to fit.
const DENSE_ROWS = flattenNodes(DENSE_TIMELINE_NODES);
const DENSE_TIME_MAP = buildTimeMap(
	DENSE_TIMELINE_NODES,
	timelineExtentMs(DENSE_TIMELINE_NODES),
	TRACK_PX
);

// ─── Scene ────────────────────────────────────────────────────────────────────
// The minimap overlays a scrolling waterfall. This reproduces that host: a
// `relative` frame with an `overflow-auto` region whose content is wider (and
// optionally taller) than the viewport, plus the minimap pointing at it via a
// captured ref. Drag the viewport box, click the track, or focus it and use the
// arrow keys to scroll the content.

function MinimapScene({
	rows,
	timeMap,
	contentWidth,
	rowHeight = 32,
	label,
}: {
	rows: { node: TimelineNode; depth: number }[];
	timeMap: TimeMap;
	contentWidth: number;
	rowHeight?: number;
	label: string;
}) {
	const [scrollEl, setScrollEl] = React.useState<HTMLDivElement | null>(null);

	return (
		<div className="w-[720px] max-w-full">
			<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
				{label}
			</p>
			<div className="border-border bg-background relative h-[320px] overflow-hidden rounded-lg border">
				{/* Keyboard-focusable scroll region: without a tabstop axe's
				    scrollable-region-focusable flags the overflow area. In the real
				    waterfall the focusable rows inside satisfy it; the faux rows here
				    aren't focusable, so the container takes the tabstop. */}
				<div
					ref={setScrollEl}
					className="h-full overflow-auto"
					role="group"
					aria-label="Timeline rows"
					tabIndex={0}
				>
					<div style={{ width: contentWidth }}>
						{rows.map(({ node }) => {
							const leftPct = timeMap.msToPct(node.startMs);
							const widthPct = Math.max(
								timeMap.msToPct(node.startMs + node.durationMs) - leftPct,
								0.5
							);
							return (
								<div
									key={node.id}
									className="border-border/70 flex items-center border-b"
									style={{ height: rowHeight }}
								>
									<div
										className="bg-background border-border text-foreground sticky left-0 z-10 shrink-0 truncate border-r px-3 font-mono text-xs"
										style={{ width: NAME_COL_WIDTH }}
									>
										{node.label}
									</div>
									<div className="relative h-full flex-1">
										<div
											className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-sm ${node.colorClass}`}
											style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<TimelineMinimap
					scrollContainer={scrollEl}
					rows={rows}
					timeMap={timeMap}
					nameColWidth={NAME_COL_WIDTH}
				/>
			</div>
		</div>
	);
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * `TimelineMinimap` is the scroll-position aid that floats over a zoomed
 * waterfall: a compressed bar chart of every row plus a draggable viewport box
 * showing the visible window. It reads scroll/size metrics straight from the
 * host `scrollContainer` (offset by the sticky `nameColWidth`), so it renders
 * only once that element and at least one row exist. It is a scroll aid, not a
 * value selector — the track is a labelled, keyboard-navigable group, not a
 * slider.
 */
const meta: Meta<typeof TimelineMinimap> = {
	title: "Components/Timeline/TimelineMinimap",
	component: TimelineMinimap,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof TimelineMinimap>;

// ─── Default ──────────────────────────────────────────────────────────────────
// The shared trace in a scroll region wider than the viewport — the viewport box
// tracks the horizontal scroll offset.

export const Default: Story = {
	render: () => (
		<MinimapScene
			rows={ROWS}
			timeMap={TIME_MAP}
			contentWidth={1600}
			label="Waterfall wider than its viewport"
		/>
	),
};

// ─── Both axes ────────────────────────────────────────────────────────────────
// Taller rows push the content past the viewport vertically too, so the box
// moves on both axes.

export const BothAxes: Story = {
	render: () => (
		<MinimapScene
			rows={ROWS}
			timeMap={TIME_MAP}
			contentWidth={1600}
			rowHeight={56}
			label="Overflow on both axes"
		/>
	),
};

// ─── Dense (compressed pitch) ─────────────────────────────────────────────────
// 120 rows: the minimap compresses its bar pitch to keep every span visible, and
// the viewport box shrinks to the small fraction of the trace on screen.

export const DenseCompressed: Story = {
	render: () => (
		<MinimapScene
			rows={DENSE_ROWS}
			timeMap={DENSE_TIME_MAP}
			contentWidth={2200}
			label="120 spans — compressed bar pitch"
		/>
	),
};
