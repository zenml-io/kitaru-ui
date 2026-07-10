import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	OnboardingProgressBar,
	OnboardingProgressRing,
} from "./OnboardingProgress";

/**
 * The onboarding progress primitives. `OnboardingProgressBar` is a labelled,
 * clamped wrapper over the `Progress` primitive used in the checklist header;
 * `OnboardingProgressRing` is a compact SVG ring used inside the floating
 * widget pill. Both clamp their value to 0–100 and expose an accessible
 * percentage — the ring can also be made `decorative` when a parent control
 * already names the progress.
 */
const meta: Meta<typeof OnboardingProgressBar> = {
	title: "Components/OnboardingProgress",
	component: OnboardingProgressBar,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=305-929",
		},
	},
	args: {
		value: 60,
		label: "Onboarding progress",
	},
	argTypes: {
		value: {
			control: { type: "range", min: 0, max: 100, step: 1 },
		},
	},
};

export default meta;
type Story = StoryObj<typeof OnboardingProgressBar>;

// ─── Default (args-driven bar) ────────────────────────────────────────────────

export const Default: Story = {
	render: (args) => (
		<div className="w-72">
			<OnboardingProgressBar {...args} />
		</div>
	),
};

// ─── Bar values ───────────────────────────────────────────────────────────────
// The bar across the full completion range. The label defaults to "N% complete"
// when none is passed.

export const BarValues: Story = {
	render: () => (
		<div className="flex w-72 flex-col gap-4">
			{[0, 25, 50, 75, 100].map((value) => (
				<div key={value} className="flex items-center gap-3">
					<OnboardingProgressBar value={value} className="flex-1" />
					<span className="text-muted-foreground w-10 shrink-0 text-right text-xs tabular-nums">
						{value}%
					</span>
				</div>
			))}
		</div>
	),
};

// ─── Bar clamping ─────────────────────────────────────────────────────────────
// Values outside 0–100 are clamped, so an over- or under-counted step total
// never renders a broken bar.

export const BarClamping: Story = {
	render: () => (
		<div className="flex w-72 flex-col gap-4">
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">value={-20} → 0%</span>
				<OnboardingProgressBar value={-20} label="Under-counted progress" />
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">
					value={120} → 100%
				</span>
				<OnboardingProgressBar value={120} label="Over-counted progress" />
			</div>
		</div>
	),
};

// ─── Ring sizes ───────────────────────────────────────────────────────────────
// The ring scales with the `size` prop; the arc is drawn in the primary color
// over a muted track.

export const RingSizes: Story = {
	render: () => (
		<div className="flex items-center gap-6">
			{[24, 32, 48, 64].map((size) => (
				<div key={size} className="flex flex-col items-center gap-2">
					<OnboardingProgressRing
						value={66}
						size={size}
						strokeWidth={size / 12}
					/>
					<span className="text-muted-foreground text-xs tabular-nums">
						{size}px
					</span>
				</div>
			))}
		</div>
	),
};

// ─── Ring values ──────────────────────────────────────────────────────────────
// The arc length reflects the clamped percentage. Each ring exposes an
// accessible "N% complete" name.

export const RingValues: Story = {
	render: () => (
		<div className="flex items-center gap-6">
			{[0, 33, 66, 100].map((value) => (
				<div key={value} className="flex flex-col items-center gap-2">
					<OnboardingProgressRing value={value} size={48} strokeWidth={4} />
					<span className="text-muted-foreground text-xs tabular-nums">
						{value}%
					</span>
				</div>
			))}
		</div>
	),
};

// ─── Decorative ring ──────────────────────────────────────────────────────────
// Inside the widget pill the ring is `decorative` — the pill's own accessible
// name already announces progress, so the ring is hidden from assistive tech to
// avoid a duplicate reading.

export const RingDecorative: Story = {
	render: () => (
		<span className="bg-card flex items-center gap-2.5 rounded-full border py-2 pr-4 pl-2.5">
			<OnboardingProgressRing value={40} decorative />
			<span className="text-primary text-xs font-semibold tabular-nums">
				2 of 5
			</span>
			<span className="text-foreground text-sm font-medium">
				Finish setting up
			</span>
		</span>
	),
};

// ─── Composed: checklist header ───────────────────────────────────────────────
// How the bar reads in the onboarding checklist card header: a flexible bar
// paired with a "N of M complete" count.

export const ComposedChecklistHeader: Story = {
	render: () => (
		<div className="border-border bg-card flex w-96 flex-col gap-1 rounded-lg border p-6">
			<h2 className="text-foreground text-lg font-semibold">
				Get your first flow running
			</h2>
			<p className="text-muted-foreground text-sm">
				A few steps to a reproducible flow on a managed stack.
			</p>
			<div className="flex items-center gap-3 pt-2.5">
				<OnboardingProgressBar
					value={60}
					label="Onboarding progress"
					className="flex-1"
				/>
				<span className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">
					3 of 5 complete
				</span>
			</div>
		</div>
	),
};
