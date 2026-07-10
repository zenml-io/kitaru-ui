import type { Meta, StoryObj } from "@storybook/react-vite";

import { buildTimeMap } from "@zenml/hashi/lib/timeline/time-map";
import { timelineExtentMs } from "@zenml/hashi/lib/timeline/flatten-nodes";
import { GAP_TONE_STYLES } from "@zenml/hashi/lib/timeline/gap-styles";
import type { IdleGap } from "@zenml/hashi/lib/timeline/time-map";
import type { TimelineNode } from "@zenml/hashi/lib/timeline/types";

import { TIMELINE_NODES } from "../../storybook/fixtures";

import { TimelineGapStripe } from "./TimelineGapStripe";

// ─── Fixtures ─────────────────────────────────────────────────────────────────
// The stripes below are the real `IdleGap`s that `buildTimeMap` materializes —
// startPct/endPct/duration all come from the helper, not hand math.

const TRACK_PX = 760;

// The shared tree's `await_gpu` node collapses into a warning-toned stripe with
// a host label + description.
const COMPRESSED_MAP = buildTimeMap(
	TIMELINE_NODES,
	timelineExtentMs(TIMELINE_NODES),
	TRACK_PX
);
const WARNING_GAP = COMPRESSED_MAP.gaps.find((g) => g.tone === "warning")!;

// A neutral-toned collapsed gap: an explicit pause node with no host tone falls
// back to the neutral ramp and the "Idle" label. (Only explicit waits collapse —
// engine idle time between spans now renders as plain elapsed time, not a stripe.)
const IDLE_NODES: TimelineNode[] = [
	{
		id: "load_features",
		label: "load_features",
		startMs: 0,
		durationMs: 3000,
		children: [],
		colorClass: "bg-success",
	},
	{
		id: "idle_pause",
		label: "idle",
		startMs: 3000,
		durationMs: 67000,
		children: [],
		colorClass: "bg-muted",
		collapsesToGap: true,
	},
	{
		id: "score_batch",
		label: "score_batch",
		startMs: 70000,
		durationMs: 4000,
		children: [],
		colorClass: "bg-success",
	},
];
const IDLE_MAP = buildTimeMap(
	IDLE_NODES,
	timelineExtentMs(IDLE_NODES),
	TRACK_PX
);
const NEUTRAL_GAP = IDLE_MAP.gaps.find((g) => g.tone === "neutral")!;

// ─── Frame ────────────────────────────────────────────────────────────────────
// The stripe is a transparent hover/tooltip hit area; the waterfall paints the
// coloured band underneath separately. This frame reproduces that band + a few
// faux rows so the stripe reads and its hover darkening lands on real color.

function GapBand({ gap, label }: { gap: IdleGap; label: string }) {
	const tone = GAP_TONE_STYLES[gap.tone];
	return (
		<div className="w-[760px] max-w-full">
			<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
				{label}
			</p>
			<div className="border-border bg-background relative h-28 overflow-hidden rounded-lg border">
				<div className="divide-border/70 absolute inset-0 flex flex-col divide-y">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex-1" />
					))}
				</div>
				<span
					className={`absolute top-0 bottom-0 ${tone.rowBg}`}
					style={{
						left: `${gap.startPct}%`,
						width: `${gap.endPct - gap.startPct}%`,
					}}
				/>
				<TimelineGapStripe gap={gap} />
			</div>
			<p className="text-muted-foreground mt-2 text-xs">
				Hover the band for the tooltip.
			</p>
		</div>
	);
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * `TimelineGapStripe` is the hover + tooltip hit area for a collapsed idle
 * segment on the timeline. Appearance comes entirely from the gap's `tone`
 * (hashi owns the ramp in `gap-styles`) and the host-supplied `label` /
 * `description`; the coloured band beneath it is painted by the waterfall. The
 * trigger is `aria-hidden` — the neighbouring spans carry the accessible
 * timeline — and reveals a duration tooltip on hover.
 */
const meta: Meta<typeof TimelineGapStripe> = {
	title: "Components/Timeline/TimelineGapStripe",
	component: TimelineGapStripe,
	parameters: {
		layout: "fullscreen",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=350-1224",
		},
	},
};

export default meta;
type Story = StoryObj<typeof TimelineGapStripe>;

// ─── Default (warning tone) ───────────────────────────────────────────────────
// The `await_gpu` pause: a warning stripe with a host label and description.

export const Default: Story = {
	render: () => (
		<GapBand gap={WARNING_GAP} label="Warning tone — queued for GPU" />
	),
};

// ─── Neutral idle ─────────────────────────────────────────────────────────────
// Engine-detected idle time with no host label falls back to "Idle" and the
// neutral ramp.

export const NeutralIdle: Story = {
	render: () => (
		<GapBand gap={NEUTRAL_GAP} label="Neutral tone — engine idle" />
	),
};

// ─── Both tones ───────────────────────────────────────────────────────────────
// The two tones side by side — neutral for engine idle, warning for a
// host-marked pause like a human approval or a resource wait.

export const Tones: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<GapBand gap={NEUTRAL_GAP} label="Neutral" />
			<GapBand gap={WARNING_GAP} label="Warning" />
		</div>
	),
};
