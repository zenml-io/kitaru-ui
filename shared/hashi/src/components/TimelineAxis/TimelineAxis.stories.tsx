import type { Meta, StoryObj } from "@storybook/react-vite";

import { buildTimeMap } from "@zenml/hashi/lib/timeline/time-map";
import { timelineExtentMs } from "@zenml/hashi/lib/timeline/flatten-nodes";
import { GAP_TONE_STYLES } from "@zenml/hashi/lib/timeline/gap-styles";

import { TIMELINE_NODES } from "../../storybook/fixtures";

import { TimelineAxis } from "./TimelineAxis";

// ─── Fixtures ─────────────────────────────────────────────────────────────────
// Real TimeMaps built from the shared workflow tree with the actual helper —
// never hand-rolled ms→pct math. `containerPx` only affects how the idle gap is
// compressed; the axis re-measures its own rendered width for tick spacing.

const TRACK_PX = 820;
const EXTENT_MS = timelineExtentMs(TIMELINE_NODES);

// Compressed scale collapses the ~90s `await_gpu` gap into a fixed stripe, so
// the active spans keep room to breathe. This is the only scale — waits always
// compress to a fixed-width stripe.
const COMPRESSED_MAP = buildTimeMap(TIMELINE_NODES, EXTENT_MS, TRACK_PX);

// A short, gapless slice (ingest + chunk only) for the simple continuous case.
const SHORT_NODES = TIMELINE_NODES.slice(0, 2);
const SHORT_MAP = buildTimeMap(
	SHORT_NODES,
	timelineExtentMs(SHORT_NODES),
	TRACK_PX
);

// ─── Frame ────────────────────────────────────────────────────────────────────
// Mirrors the waterfall header: a name-column spacer, then the axis filling the
// rest. `nameColWidth` matches the timeline geometry used by the rows.

const NAME_COL_WIDTH = 240;
const LEFT_PAD = 6;
const RIGHT_PAD = 80;

function AxisFrame({
	children,
	label,
}: {
	children: React.ReactNode;
	label: string;
}) {
	return (
		<div className="w-[860px] max-w-full">
			<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
				{label}
			</p>
			<div className="border-border bg-background overflow-hidden rounded-lg border">
				<div className="border-border flex items-stretch border-b">
					<div
						className="border-border text-muted-foreground flex shrink-0 items-center border-r px-4 text-xs font-medium"
						style={{ width: NAME_COL_WIDTH }}
					>
						Span
					</div>
					<div className="relative flex-1 py-2">{children}</div>
				</div>
			</div>
		</div>
	);
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * `TimelineAxis` renders the time ruler above a waterfall: nice-number tick
 * labels (`buildTicks`) laid onto a `TimeMap`. It measures its own width with a
 * `ResizeObserver` and re-picks the tick interval so labels never collide, and
 * skips ticks inside compressed idle segments. Positioning-only — the axis owns
 * no interactive controls; the host aligns it to the rows via `leftPadPx` /
 * `rightPadPx`.
 */
const meta: Meta<typeof TimelineAxis> = {
	title: "Components/Timeline/TimelineAxis",
	component: TimelineAxis,
	parameters: {
		layout: "fullscreen",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=349-1197",
		},
	},
	args: {
		leftPadPx: LEFT_PAD,
		rightPadPx: RIGHT_PAD,
	},
};

export default meta;
type Story = StoryObj<typeof TimelineAxis>;

// ─── Default (compressed scale) ───────────────────────────────────────────────

export const Default: Story = {
	render: (args) => (
		<AxisFrame label="Compressed scale — full workflow trace">
			<TimelineAxis {...args} timeMap={COMPRESSED_MAP} />
		</AxisFrame>
	),
};

// ─── Continuous (no gaps) ─────────────────────────────────────────────────────
// A short, gapless slice — the everyday case of an evenly ticked ruler.

export const WithoutGaps: Story = {
	render: (args) => (
		<AxisFrame label="No idle gaps — ingest + chunk only">
			<TimelineAxis {...args} timeMap={SHORT_MAP} />
		</AxisFrame>
	),
};

// ─── Composed: header with gap tint ───────────────────────────────────────────
// How the waterfall actually renders it — the axis over the compressed idle
// band, tinted with the gap's warning tone so the pause reads on the ruler too.

export const ComposedHeader: Story = {
	render: (args) => (
		<AxisFrame label="Composed — axis over a tinted idle band">
			<div
				className="pointer-events-none absolute inset-0"
				style={{ marginLeft: LEFT_PAD, marginRight: RIGHT_PAD }}
			>
				{COMPRESSED_MAP.gaps.map((gap, i) => (
					<span
						key={`gap-${i}`}
						className={`absolute top-0 bottom-0 ${GAP_TONE_STYLES[gap.tone].axisBg}`}
						style={{
							left: `${gap.startPct}%`,
							width: `${gap.endPct - gap.startPct}%`,
						}}
					/>
				))}
			</div>
			<TimelineAxis {...args} timeMap={COMPRESSED_MAP} />
		</AxisFrame>
	),
};
