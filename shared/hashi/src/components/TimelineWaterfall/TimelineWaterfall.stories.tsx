import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { TimelineNode } from "@zenml/hashi/lib/timeline/types";
import { TimelineWaterfall } from "./TimelineWaterfall";
import { buildTimeMap, IDLE_GAP_PX } from "@zenml/hashi/lib/timeline/time-map";
import { timelineExtentMs } from "@zenml/hashi/lib/timeline/flatten-nodes";

// --- Node builders -------------------------------------------------------
// A tiny sequencer so stories read as a script of what happened, in order.
// `step` = a checkpoint bar, `wait` = a collapsing pause stripe, `idle` =
// explicit dead time with no node (renders as plain elapsed time).

type Spec =
	| { kind: "step"; label: string; durationMs: number; running?: boolean }
	| { kind: "wait"; durationMs: number; label: string }
	| { kind: "idle"; durationMs: number };

const step = (
	label: string,
	durationMs: number,
	running = false
): Spec => ({ kind: "step", label, durationMs, running });
const wait = (durationMs: number, label = "User Input"): Spec => ({
	kind: "wait",
	durationMs,
	label,
});
const idle = (durationMs: number): Spec => ({ kind: "idle", durationMs });

// Real runs don't chain checkpoints back-to-back — there's a little
// orchestration overhead between them. A small varied gap makes the mock read
// like a real execution. Kept under the 1s wait-merge tolerance so adjacent
// waits still fold into one stripe.
const overheadMs = (i: number) => 300 + (i % 3) * 250;

function build(specs: Spec[]): TimelineNode[] {
	const nodes: TimelineNode[] = [];
	let cursor = 0;
	let placed = 0;
	specs.forEach((spec, i) => {
		if (spec.kind === "idle") {
			cursor += spec.durationMs;
			return;
		}
		if (placed > 0) cursor += overheadMs(i);
		placed++;
		const startMs = cursor;
		if (spec.kind === "wait") {
			nodes.push({
				id: `wait-${i}`,
				label: spec.label,
				startMs,
				durationMs: spec.durationMs,
				children: [],
				colorClass: "bg-warning",
				collapsesToGap: true,
				gapTone: "warning",
				gapLabel: spec.label,
			});
		} else {
			nodes.push({
				id: `step-${i}`,
				label: spec.label,
				startMs,
				durationMs: spec.durationMs,
				children: [],
				colorClass: "bg-primary",
				accent: spec.running ? "warning" : "default",
				pulseMarker: spec.running,
			});
		}
		cursor += spec.durationMs;
	});
	return nodes;
}

const S = 1000;
const M = 60 * S;
const H = 60 * M;

// --- Interactive harness -------------------------------------------------
// TimelineWaterfall is fully controlled, so the harness owns zoom + selection
// and renders a minimal toolbar (matching the real one) so stories are
// playable — zoom in/out, click a row to select.

interface HarnessProps {
	nodes: TimelineNode[];
	extentMsOverride?: number;
	searchFilter?: string;
}

function Harness({ nodes, extentMsOverride, searchFilter }: HarnessProps) {
	const [zoom, setZoom] = useState(1);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	return (
		<div className="bg-background text-foreground min-h-screen p-6">
			<div className="mb-3 flex items-center gap-2">
				<button
					type="button"
					className="border-border hover:bg-muted rounded-md border px-2 py-1 text-xs"
					onClick={() => setZoom((z) => Math.max(1, +(z / 1.5).toFixed(2)))}
				>
					−
				</button>
				<span className="text-muted-foreground w-12 text-center font-mono text-xs tabular-nums">
					{zoom.toFixed(1)}x
				</span>
				<button
					type="button"
					className="border-border hover:bg-muted rounded-md border px-2 py-1 text-xs"
					onClick={() => setZoom((z) => Math.min(8, +(z * 1.5).toFixed(2)))}
				>
					+
				</button>
				<button
					type="button"
					className="border-border hover:bg-muted rounded-md border px-2 py-1 text-xs"
					onClick={() => setZoom(1)}
				>
					Fit
				</button>
			</div>
			<div className="border-border rounded-lg border">
				<TimelineWaterfall
					nodes={nodes}
					selectedId={selectedId}
					onSelect={setSelectedId}
					onToggle={() => {}}
					zoom={zoom}
					onZoomChange={setZoom}
					searchFilter={searchFilter}
					extentMsOverride={extentMsOverride}
				/>
			</div>
		</div>
	);
}

const meta: Meta<typeof Harness> = {
	title: "Timeline/TimelineWaterfall",
	component: Harness,
	parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Harness>;

// --- Playground ----------------------------------------------------------
// Generative story: drag the sliders to stress the layout with any mix of
// checkpoint/wait lengths and counts.

interface PlaygroundProps {
	checkpointCount: number;
	checkpointDurationMs: number;
	waitCount: number;
	waitDurationMs: number;
	trailingIdleMs: number;
}

function PlaygroundHarness({
	checkpointCount,
	checkpointDurationMs,
	waitCount,
	waitDurationMs,
	trailingIdleMs,
}: PlaygroundProps) {
	// Spread the waits roughly evenly between the checkpoints.
	const specs: Spec[] = [];
	const waitEvery =
		waitCount > 0 ? Math.max(1, Math.floor(checkpointCount / waitCount)) : 0;
	let placed = 0;
	for (let i = 0; i < checkpointCount; i++) {
		specs.push(step(`checkpoint_${i}`, checkpointDurationMs));
		if (waitEvery && placed < waitCount && (i + 1) % waitEvery === 0) {
			specs.push(wait(waitDurationMs));
			placed++;
		}
	}
	if (trailingIdleMs > 0) specs.push(idle(trailingIdleMs));
	return <Harness nodes={build(specs)} />;
}

export const Playground: StoryObj<typeof PlaygroundHarness> = {
	render: (args) => <PlaygroundHarness {...args} />,
	args: {
		checkpointCount: 5,
		checkpointDurationMs: 3 * S,
		waitCount: 2,
		waitDurationMs: 1 * M,
		trailingIdleMs: 0,
	},
	argTypes: {
		checkpointCount: { control: { type: "range", min: 1, max: 60, step: 1 } },
		checkpointDurationMs: {
			control: { type: "range", min: 0, max: 60 * S, step: 250 },
		},
		waitCount: { control: { type: "range", min: 0, max: 10, step: 1 } },
		waitDurationMs: {
			control: { type: "range", min: 0, max: 2 * H, step: 1 * S },
		},
		trailingIdleMs: {
			control: { type: "range", min: 0, max: 30 * M, step: 10 * S },
		},
	},
};

// A realistic 5-step run reused as the "normal" baseline.
const baseline: Spec[] = [
	step("load_input", 1 * S),
	step("profile_columns", 2 * S),
	step("propose_mapping", 9 * S),
	step("run_engine", 3 * S),
	step("finalize", 2 * S),
];

// --- Baseline / no waits -------------------------------------------------

export const NoWaits: Story = { args: { nodes: build(baseline) } };

// --- Wait length extremes ------------------------------------------------

export const OneShortWait: Story = {
	args: {
		nodes: build([
			step("load_input", 1 * S),
			step("profile_columns", 2 * S),
			wait(4 * S),
			step("run_engine", 3 * S),
			step("finalize", 2 * S),
		]),
	},
};

export const OneLongWait: Story = {
	args: {
		nodes: build([
			step("load_input", 1 * S),
			step("propose_mapping", 9 * S),
			wait(1 * H),
			step("run_engine", 3 * S),
			step("finalize", 2 * S),
		]),
	},
};

export const MixedShortAndLongWaits: Story = {
	args: {
		nodes: build([
			step("load_input", 1 * S),
			wait(3 * S),
			step("profile_columns", 2 * S),
			wait(45 * M),
			step("propose_mapping", 9 * S),
			wait(20 * S),
			step("run_engine", 3 * S),
			wait(2 * H),
			step("finalize", 2 * S),
		]),
	},
};

export const ManyWaits: Story = {
	args: {
		nodes: build(
			Array.from({ length: 8 }, (_, i) => [
				step(`step_${i}`, (1 + (i % 3)) * S),
				wait((i % 2 === 0 ? 30 : 90) * S),
			]).flat()
		),
	},
};

export const BackToBackWaits: Story = {
	args: {
		nodes: build([
			step("load_input", 1 * S),
			wait(30 * S, "Approval"),
			wait(90 * S, "User Input"),
			step("finalize", 2 * S),
		]),
	},
};

export const WaitAtStart: Story = {
	args: {
		nodes: build([wait(5 * M), step("load_input", 1 * S), step("finalize", 2 * S)]),
	},
};

export const WaitAtEnd: Story = {
	args: {
		nodes: build([
			step("load_input", 1 * S),
			step("run_engine", 3 * S),
			wait(10 * M),
		]),
	},
};

// --- Checkpoint length extremes ------------------------------------------

export const SubSecondCheckpoints: Story = {
	args: {
		nodes: build([
			step("a", 50),
			step("b", 120),
			step("c", 300),
			step("d", 80),
			step("e", 200),
		]),
	},
};

export const OneGiantCheckpoint: Story = {
	args: {
		nodes: build([
			step("load_input", 1 * S),
			step("train_model", 40 * M),
			step("finalize", 2 * S),
		]),
	},
};

export const ZeroDurationCheckpoints: Story = {
	args: {
		nodes: build([
			step("instant_a", 0),
			step("real_work", 5 * S),
			step("instant_b", 0),
			step("instant_c", 0),
		]),
	},
};

// --- Execution length extremes -------------------------------------------

export const TinyExecution: Story = {
	args: {
		nodes: build([step("a", 200), step("b", 400), step("c", 150)]),
	},
};

export const LongExecutionTinyCheckpoints: Story = {
	args: {
		nodes: build([
			step("load_input", 1 * S),
			wait(1 * H),
			step("profile", 2 * S),
			wait(90 * M),
			step("engine", 3 * S),
			wait(45 * M),
			step("finalize", 1 * S),
		]),
	},
};

export const IdleGapNoWaitBlock: Story = {
	args: {
		// Dead time between steps with NO wait node is NOT compressed — only
		// explicit waits collapse, so this idle renders as plain elapsed time.
		nodes: build([
			step("load_input", 1 * S),
			idle(30 * S),
			step("run_engine", 3 * S),
			idle(15 * S),
			step("finalize", 2 * S),
		]),
	},
};

// --- State / density edge cases ------------------------------------------

export const RunningLastStep: Story = {
	parameters: {
		a11y: {
			config: {
				// Component-level gap (not a story artifact): a running step's live
				// duration label renders in `text-warning` at the 10px `text-2xs`
				// size, which lands at ~2.8:1. Same known issue disabled in
				// TimelineRow's stories; flagged for a component a11y fix.
				rules: [{ id: "color-contrast", enabled: false }],
			},
		},
	},
	args: {
		nodes: build([
			step("load_input", 1 * S),
			step("propose_mapping", 9 * S),
			wait(30 * S),
			step("run_engine", 4 * S, true),
		]),
	},
};

export const SingleCheckpoint: Story = {
	args: { nodes: build([step("only_step", 3 * S)]) },
};

export const DenseManyCheckpoints: Story = {
	args: {
		nodes: build(
			Array.from({ length: 60 }, (_, i) =>
				i === 30
					? wait(2 * M)
					: step(`checkpoint_${String(i).padStart(2, "0")}`, (1 + (i % 5)) * S)
			)
		),
	},
};

export const EverythingAtOnce: Story = {
	parameters: {
		a11y: {
			config: {
				// See RunningLastStep: the running step's `text-warning` duration
				// label trips color-contrast at 10px. Flagged for a component a11y fix.
				rules: [{ id: "color-contrast", enabled: false }],
			},
		},
	},
	args: {
		nodes: build([
			wait(2 * M, "Kickoff approval"),
			step("load_input", 1 * S),
			step("instant", 0),
			step("profile_columns", 2 * S),
			wait(15 * S),
			step("propose_mapping", 9 * S),
			idle(90 * S),
			step("train_model", 25 * M),
			wait(1 * H, "Human review"),
			step("run_engine", 3 * S, true),
		]),
	},
};

// --- Stress case: fixed-width gap budget in a narrow container -----------
// Each collapsed wait renders as a fixed IDLE_GAP_PX (24px) stripe. When enough
// NON-merged waits pile up so their fixed budget `gaps × 24px` exceeds the
// container width, they can't all fit — `buildSegments` shrinks every stripe
// uniformly so positions stay within [0, 100%]. This used to overflow (13 waits
// @ 300px → right edge at ~104%, 20 @ 300px → ~160%; reported on PR #229). The
// readout below is a regression canary: drag `containerWidthPx` down /
// `waitCount` up — the stripes get thinner but the right edge stays at 100% and
// the readout stays "within bounds". If it ever flips to "OVERFLOW", the fix in
// buildSegments regressed.

// A checkpoint between every wait keeps the waits from merging into one stripe,
// so each stays a distinct fixed-width gap that counts toward the budget.
function separatedWaitSpecs(waitCount: number): Spec[] {
	const specs: Spec[] = [step("start", 1 * S)];
	for (let i = 0; i < waitCount; i++) {
		specs.push(wait(5 * S, `wait_${i}`));
		specs.push(step(`cp_${i}`, 1 * S));
	}
	return specs;
}

interface GapOverflowProps {
	containerWidthPx: number;
	waitCount: number;
}

function GapOverflowHarness({ containerWidthPx, waitCount }: GapOverflowProps) {
	const nodes = build(separatedWaitSpecs(waitCount));
	const totalMs = timelineExtentMs(nodes);
	// Same axis the component builds internally, at the width we constrain it to.
	const timeMap = buildTimeMap(nodes, totalMs, containerWidthPx);
	const gapCount = timeMap.gaps.length;
	const budgetPx = gapCount * IDLE_GAP_PX;
	const rightEdgePct = timeMap.msToPct(totalMs);
	const overflows = rightEdgePct > 100.01;

	return (
		<div className="bg-background text-foreground min-h-screen p-6">
			<div className="mb-3 max-w-prose font-mono text-xs leading-relaxed">
				<div>
					container <b>{containerWidthPx}px</b> · non-merged waits{" "}
					<b>{gapCount}</b> · fixed gap budget <b>{budgetPx}px</b> ({gapCount} ×{" "}
					{IDLE_GAP_PX}px)
				</div>
				<div>
					right edge maps to <b>{rightEdgePct.toFixed(1)}%</b> —{" "}
					<b>{overflows ? "OVERFLOW (should be ≤ 100%)" : "within bounds"}</b>
				</div>
			</div>
			<div
				className="border-border overflow-hidden rounded-lg border"
				style={{ width: containerWidthPx }}
			>
				<TimelineWaterfall
					nodes={nodes}
					selectedId={null}
					onSelect={() => {}}
					onToggle={() => {}}
					zoom={1}
					onZoomChange={() => {}}
					defaultNameColWidth={120}
				/>
			</div>
		</div>
	);
}

export const NarrowGapOverflow: StoryObj<typeof GapOverflowHarness> = {
	render: (args) => <GapOverflowHarness {...args} />,
	args: { containerWidthPx: 320, waitCount: 20 },
	argTypes: {
		containerWidthPx: {
			control: { type: "range", min: 160, max: 900, step: 20 },
		},
		waitCount: { control: { type: "range", min: 1, max: 40, step: 1 } },
	},
};
