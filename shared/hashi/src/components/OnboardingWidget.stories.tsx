import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { getOnboardingSetup } from "@zenml/hashi/lib/onboarding";
import { Button } from "@zenml/hashi/primitives/button";

import {
	ONBOARDING_STEP_TITLES,
	ONBOARDING_STEPS,
	ONBOARDING_WORKSPACE_TITLE,
	type OnboardingStep,
} from "../storybook/fixtures";

import {
	OnboardingWidgetCard,
	OnboardingWidgetPill,
	OnboardingWidgetStepRow,
	type OnboardingWidgetItem,
} from "./OnboardingWidget";

// ─── Fixtures ─────────────────────────────────────────────────────────────────
// The widget's rows map 1:1 to the onboarding setup: an implicit, always-done
// workspace row plus one row per tracked step, its state derived from
// `getOnboardingSetup` exactly as the floating widget does in the app.

function widgetItems(state: OnboardingStep[]): OnboardingWidgetItem[] {
	const setup = getOnboardingSetup(state, ONBOARDING_STEPS);
	return [
		{
			id: "workspace_created",
			label: ONBOARDING_WORKSPACE_TITLE,
			state: "done",
		},
		...ONBOARDING_STEPS.steps.map((step): OnboardingWidgetItem => {
			const item = setup.getItem(step);
			return {
				id: step,
				label: ONBOARDING_STEP_TITLES[step],
				state: item.isCompleted
					? "done"
					: item.hasDownstreamStep
						? "skipped"
						: item.isActive
							? "current"
							: "upcoming",
			};
		}),
	];
}

const MID_STATE: OnboardingStep[] = [
	"project_created",
	"stack_with_remote_artifact_store_created",
];
const FRESH_STATE: OnboardingStep[] = [];
const midSetup = getOnboardingSetup(MID_STATE, ONBOARDING_STEPS);

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * The floating "finish setting up" widget. `OnboardingWidgetCard` is the
 * expanded panel (progress bar + step list + resume/dismiss actions),
 * `OnboardingWidgetPill` is its collapsed state, and `OnboardingWidgetStepRow`
 * is a single step row shown for each of its four states. Actions with no
 * handler are omitted, so the card can render as a read-only summary.
 */
const meta: Meta<typeof OnboardingWidgetCard> = {
	title: "Components/OnboardingWidget",
	component: OnboardingWidgetCard,
	args: {
		title: "Finish setting up",
		items: widgetItems(MID_STATE),
		itemsDone: midSetup.itemsDone,
		totalItems: midSetup.totalItems,
	},
	argTypes: {
		items: { control: false },
		onSelectStep: { control: false },
		onResume: { control: false },
		onDismiss: { control: false },
		onCollapse: { control: false },
	},
};

export default meta;
type Story = StoryObj<typeof OnboardingWidgetCard>;

// ─── Default (args-driven card) ───────────────────────────────────────────────

export const Default: Story = {
	args: {
		onSelectStep: () => {},
		onResume: () => {},
		onDismiss: () => {},
		onCollapse: () => {},
	},
};

// ─── Card: fresh start ────────────────────────────────────────────────────────
// A new account — only the implicit workspace step is done and the first
// tracked step is "Up next".

export const CardFresh: Story = {
	args: {
		items: widgetItems(FRESH_STATE),
		itemsDone: getOnboardingSetup(FRESH_STATE, ONBOARDING_STEPS).itemsDone,
		totalItems: getOnboardingSetup(FRESH_STATE, ONBOARDING_STEPS).totalItems,
		onSelectStep: () => {},
		onResume: () => {},
		onDismiss: () => {},
		onCollapse: () => {},
	},
};

// ─── Card: read-only ──────────────────────────────────────────────────────────
// With no handlers passed, the step rows are static and the footer (Dismiss /
// Resume) and collapse control are omitted entirely.

export const CardReadOnly: Story = {
	args: {},
};

// ─── Pill (collapsed) ─────────────────────────────────────────────────────────
// The collapsed widget: a decorative progress ring, the count, and the title.
// Clicking it expands back to the card.

export const Pill: Story = {
	render: () => (
		<OnboardingWidgetPill
			title="Finish setting up"
			itemsDone={midSetup.itemsDone}
			totalItems={midSetup.totalItems}
			onExpand={() => {}}
		/>
	),
};

// ─── Step rows (OnboardingWidgetStepRow) ──────────────────────────────────────
// The four row states. Non-`done` rows become interactive buttons when an
// `onSelect` is provided; `done` rows and rows without a handler are static.

export const StepRows: Story = {
	render: () => (
		<ul className="border-border bg-card flex w-72 flex-col gap-0.5 rounded-lg border p-3">
			<OnboardingWidgetStepRow
				id="done"
				label="Create your Kitaru workspace"
				state="done"
			/>
			<OnboardingWidgetStepRow
				id="skipped"
				label="Create a home for your artifacts and logs"
				state="skipped"
				onSelect={() => {}}
			/>
			<OnboardingWidgetStepRow
				id="current"
				label="Get set up locally"
				state="current"
				onSelect={() => {}}
			/>
			<OnboardingWidgetStepRow
				id="upcoming"
				label="Run your first pipeline"
				state="upcoming"
				onSelect={() => {}}
			/>
		</ul>
	),
};

// ─── Composed: live expand / collapse ─────────────────────────────────────────
// The real floating widget wiring: the pill expands to the card, the card
// collapses back to the pill, and Dismiss removes it. Mirrors
// `FloatingOnboardingProgress`.

export const Composed: Story = {
	render: function ComposedStory() {
		const [open, setOpen] = React.useState(true);
		const [dismissed, setDismissed] = React.useState(false);

		if (dismissed) {
			return (
				<Button
					variant="link"
					className="text-muted-foreground hover:text-foreground"
					onClick={() => {
						setDismissed(false);
						setOpen(true);
					}}
				>
					Widget dismissed. Bring it back
				</Button>
			);
		}

		return open ? (
			<OnboardingWidgetCard
				title="Finish setting up"
				items={widgetItems(MID_STATE)}
				itemsDone={midSetup.itemsDone}
				totalItems={midSetup.totalItems}
				onSelectStep={() => {}}
				onResume={() => {}}
				onDismiss={() => setDismissed(true)}
				onCollapse={() => setOpen(false)}
			/>
		) : (
			<OnboardingWidgetPill
				title="Finish setting up"
				itemsDone={midSetup.itemsDone}
				totalItems={midSetup.totalItems}
				onExpand={() => setOpen(true)}
			/>
		);
	},
};
