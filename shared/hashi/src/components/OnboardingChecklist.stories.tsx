import type { ReactElement, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { getOnboardingSetup } from "@zenml/hashi/lib/onboarding";

import {
	ONBOARDING_STEP_TITLES,
	ONBOARDING_STEPS,
	ONBOARDING_WORKSPACE_TITLE,
	type OnboardingStep,
} from "../storybook/fixtures";

import {
	OnboardingChecklist,
	OnboardingChecklistItem,
} from "./OnboardingChecklist";

// ─── Fixtures ─────────────────────────────────────────────────────────────────
// The checklist derives every item's state from `getOnboardingSetup` — the same
// helper the app uses — so a story is just a list of completed step ids.

const FRESH_STATE: OnboardingStep[] = [];
const MID_STATE: OnboardingStep[] = [
	"project_created",
	"stack_with_remote_artifact_store_created",
];
const SKIPPED_STATE: OnboardingStep[] = ["project_created", "device_verified"];
const COMPLETE_STATE: OnboardingStep[] = [...ONBOARDING_STEPS.steps];

// Short, realistic expandable content per step (the app renders command cards
// and help links here; these keep the shape without the app-only chrome).
function stepContent(step: OnboardingStep): ReactNode {
	switch (step) {
		case "project_created":
			return (
				<p className="text-muted-foreground text-sm">
					Kitaru projects organize your ML work. Use them to separate
					initiatives, teams, or experiments while sharing stacks, secrets, and
					flavors across your workspace.
				</p>
			);
		case "stack_with_remote_artifact_store_created":
			return (
				<p className="text-muted-foreground text-sm">
					A stack defines where and how your flows run. This testing stack
					includes remote storage so you can experience Kitaru&apos;s full
					capabilities.
				</p>
			);
		case "device_verified":
			return (
				<div className="flex flex-col gap-2">
					<p className="text-muted-foreground text-sm">
						Install Kitaru and connect your local setup to the cloud to reach
						your dashboard.
					</p>
					<pre className="bg-muted text-foreground overflow-x-auto rounded-md px-3 py-2 font-mono text-xs">
						uv pip install "kitaru==1.4.0"
					</pre>
				</div>
			);
		case "pipeline_run_with_remote_artifact_store":
			return (
				<p className="text-muted-foreground text-sm">
					Point Kitaru at your remote stack and run your first flow with the
					Python SDK to see it end to end.
				</p>
			);
	}
}

// The implicit workspace row (always complete) plus one item per tracked step,
// each wired to its derived state.
function checklistItems(state: OnboardingStep[]): ReactNode {
	const setup = getOnboardingSetup(state, ONBOARDING_STEPS);
	return (
		<>
			<OnboardingChecklistItem
				index={1}
				title={ONBOARDING_WORKSPACE_TITLE}
				isCompleted
				isActive={false}
				hasDownstreamStep={false}
			/>
			{ONBOARDING_STEPS.steps.map((step, i) => (
				<OnboardingChecklistItem
					key={step}
					index={i + 2}
					title={ONBOARDING_STEP_TITLES[step]}
					{...setup.getItem(step)}
				>
					{stepContent(step)}
				</OnboardingChecklistItem>
			))}
		</>
	);
}

function checklistFor(state: OnboardingStep[]): ReactElement {
	const setup = getOnboardingSetup(state, ONBOARDING_STEPS);
	return (
		<OnboardingChecklist
			title="Get your first flow running"
			subtitle="A few steps to a reproducible flow on a managed stack."
			itemsDone={setup.itemsDone}
			totalItems={setup.totalItems}
		>
			{checklistItems(state)}
		</OnboardingChecklist>
	);
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const midSetup = getOnboardingSetup(MID_STATE, ONBOARDING_STEPS);

const meta: Meta<typeof OnboardingChecklist> = {
	title: "Components/OnboardingChecklist",
	component: OnboardingChecklist,
	parameters: {
		layout: "padded",
	},
	args: {
		title: "Get your first flow running",
		subtitle: "A few steps to a reproducible flow on a managed stack.",
		itemsDone: midSetup.itemsDone,
		totalItems: midSetup.totalItems,
		children: checklistItems(MID_STATE),
	},
	argTypes: {
		children: { control: false },
		itemsDone: { control: { type: "number", min: 0 } },
		totalItems: { control: { type: "number", min: 1 } },
	},
	decorators: [
		(Story) => (
			<div className="w-[440px]">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof OnboardingChecklist>;

// ─── Default (args-driven, mid progress) ──────────────────────────────────────
// Project and stack are complete; "Get set up locally" is now current and open.
// This is the realistic mid-journey scene; the header numbers are live args.

export const Default: Story = {};

// ─── Fresh start ──────────────────────────────────────────────────────────────
// A brand-new account: the workspace step is implicitly done, so it reads "1 of
// 5". The first tracked step is current and auto-expands.

export const FreshStart: Story = {
	render: () => checklistFor(FRESH_STATE),
};

// ─── With a skipped step ──────────────────────────────────────────────────────
// The device was verified before a stack was created, so the stack step is
// marked Skipped — a completed downstream step means the gap can be revisited
// later rather than blocking.

export const WithSkippedStep: Story = {
	render: () => checklistFor(SKIPPED_STATE),
};

// ─── Complete ─────────────────────────────────────────────────────────────────
// Every step is done: all rows are struck through and collapsed, and the bar
// reads 5 of 5.

export const Complete: Story = {
	render: () => checklistFor(COMPLETE_STATE),
};

// ─── Item states (OnboardingChecklistItem) ────────────────────────────────────
// The four row treatments the item exposes, isolated in one checklist:
// completed (static, struck through), current ("Now", auto-open), skipped, and
// upcoming (collapsed, muted).

export const ItemStates: Story = {
	render: () => (
		<OnboardingChecklist
			title="Checklist item states"
			subtitle="Completed, current, skipped, and upcoming rows."
			itemsDone={2}
			totalItems={5}
		>
			<OnboardingChecklistItem
				index={1}
				title={ONBOARDING_WORKSPACE_TITLE}
				isCompleted
				isActive={false}
				hasDownstreamStep={false}
			/>
			<OnboardingChecklistItem
				index={2}
				title="Create a new project"
				isCompleted={false}
				isActive
				hasDownstreamStep={false}
			>
				{stepContent("project_created")}
			</OnboardingChecklistItem>
			<OnboardingChecklistItem
				index={3}
				title="Create a home for your artifacts and logs"
				isCompleted={false}
				isActive={false}
				hasDownstreamStep
			>
				{stepContent("stack_with_remote_artifact_store_created")}
			</OnboardingChecklistItem>
			<OnboardingChecklistItem
				index={4}
				title="Run your first pipeline"
				isCompleted={false}
				isActive={false}
				hasDownstreamStep={false}
			>
				{stepContent("pipeline_run_with_remote_artifact_store")}
			</OnboardingChecklistItem>
		</OnboardingChecklist>
	),
};
