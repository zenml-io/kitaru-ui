import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { TimelineScaleMode } from "@zenml/hashi/lib/timeline/time-map";
import type { TimelineNode } from "@zenml/hashi/lib/timeline/types";

import { DENSE_TIMELINE_NODES, TIMELINE_NODES } from "../../storybook/fixtures";

import { TimelineWaterfall } from "./TimelineWaterfall";

// ─── Scene ────────────────────────────────────────────────────────────────────
// The waterfall is fully controlled: the host owns the node tree (for
// expand/collapse), the selection, and the zoom. This wrapper wires all three,
// mirroring the execution-detail page.

function WaterfallDemo({
	initialNodes = TIMELINE_NODES,
	initialZoom = 1,
	searchFilter,
	forkMarkerMsList,
	timeScaleMode,
}: {
	initialNodes?: TimelineNode[];
	initialZoom?: number;
	searchFilter?: string;
	forkMarkerMsList?: number[];
	timeScaleMode?: TimelineScaleMode;
}) {
	const [nodes, setNodes] = React.useState<TimelineNode[]>(initialNodes);
	const [selectedId, setSelectedId] = React.useState<string | null>(null);
	const [zoom, setZoom] = React.useState(initialZoom);

	const toggle = (id: string) => {
		const flip = (list: TimelineNode[]): TimelineNode[] =>
			list.map((n) =>
				n.id === id
					? { ...n, expanded: !n.expanded }
					: { ...n, children: flip(n.children) }
			);
		setNodes(flip);
	};

	return (
		<div className="border-border bg-background h-[480px] w-[920px] max-w-full overflow-hidden rounded-lg border">
			<TimelineWaterfall
				nodes={nodes}
				selectedId={selectedId}
				onSelect={setSelectedId}
				onToggle={toggle}
				zoom={zoom}
				onZoomChange={setZoom}
				searchFilter={searchFilter}
				forkMarkerMsList={forkMarkerMsList}
				timeScaleMode={timeScaleMode}
			/>
		</div>
	);
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * `TimelineWaterfall` is the full trace viewer: it composes `TimelineAxis`,
 * `TimelineRow`, `TimelineGapStripe`, and `TimelineMinimap` over a shared
 * `TimeMap` built from a span tree. It handles the flatten + gap collapsing,
 * a resizable name column, keyboard zoom (`+` / `-` / `0`), auto-zoom for dense
 * traces, and the floating minimap once zoomed in. Selection, expansion, and
 * zoom are controlled by the host.
 */
const meta: Meta<typeof TimelineWaterfall> = {
	title: "Components/Timeline/TimelineWaterfall",
	component: TimelineWaterfall,
	parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof TimelineWaterfall>;

// Component-level a11y gap (not a story artifact): TimelineRow is `role="button"`
// (click-to-select) and renders the expand chevron as a nested `<button>`, so any
// view with expandable parent rows nests interactive controls. Every waterfall
// story except `Filtered` (leaf rows only) shows parents, so they share this
// waiver. Flagged for a component a11y fix — after which this comes out.
const expandableRowWaiver = {
	a11y: { config: { rules: [{ id: "nested-interactive", enabled: false }] } },
};

// ─── Default ──────────────────────────────────────────────────────────────────
// The whole trace at 1× — axis, rows, the collapsed `await_gpu` pause stripe,
// and a nested train step. Click a row to select it, or use the chevrons to
// expand/collapse. Drag the divider to resize the name column.

export const Default: Story = {
	parameters: expandableRowWaiver,
	render: () => <WaterfallDemo />,
};

// ─── Zoomed (with minimap) ────────────────────────────────────────────────────
// At 2× the time axis overflows horizontally and the floating minimap appears
// bottom-right; drag its viewport box (or the track) to pan.

export const Zoomed: Story = {
	parameters: expandableRowWaiver,
	render: () => <WaterfallDemo initialZoom={2} />,
};

// ─── Filtered ─────────────────────────────────────────────────────────────────
// `searchFilter` keeps only rows whose label matches — here the two training
// epochs.

export const Filtered: Story = {
	render: () => <WaterfallDemo searchFilter="epoch" />,
};

// ─── Linear scale ─────────────────────────────────────────────────────────────
// `timeScaleMode="linear"` maps time proportionally instead of compressing idle
// gaps, so the ~90s GPU queue dominates the width.

export const LinearScale: Story = {
	parameters: expandableRowWaiver,
	render: () => <WaterfallDemo timeScaleMode="linear" />,
};

// ─── Fork markers ─────────────────────────────────────────────────────────────
// `forkMarkerMsList` drops dashed vertical markers at given timestamps — the
// replay/compare surfaces use these to show where a re-run would branch.

export const ForkMarkers: Story = {
	parameters: expandableRowWaiver,
	render: () => <WaterfallDemo forkMarkerMsList={[105200]} />,
};

// ─── Dense trace (auto-zoom) ──────────────────────────────────────────────────
// Past `autoZoomThreshold` (100 rows) the waterfall zooms itself so span bars
// stay legible, which also summons the floating minimap. 120 flat spans — the
// shared dense fixture — cross the threshold on mount. No waiver needed: leaf
// rows have no expand button.

export const DenseAutoZoom: Story = {
	render: () => <WaterfallDemo initialNodes={DENSE_TIMELINE_NODES} />,
};
