import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./card";
import { Progress, ProgressLabel, ProgressValue } from "./progress";

/**
 * Linear progress bar built on Base UI. The `Progress` wrapper renders the
 * track and indicator; slot a `ProgressLabel` and `ProgressValue` as children
 * for the caption row. A `ProgressLabel` also supplies the progressbar's
 * accessible name, so include one (or an `aria-label`) on every instance.
 */
const meta: Meta<typeof Progress> = {
	title: "Primitives/Progress",
	component: Progress,
	args: { value: 60 },
	argTypes: {
		value: { control: { type: "range", min: 0, max: 100, step: 1 } },
	},
};

export default meta;
type Story = StoryObj<typeof Progress>;

// ─── Default (args-driven) ────────────────────────────────────────────────────

export const Default: Story = {
	render: (args) => (
		<div className="w-80">
			<Progress {...args}>
				<ProgressLabel>Downloading model weights</ProgressLabel>
				<ProgressValue />
			</Progress>
		</div>
	),
};

// ─── Values ───────────────────────────────────────────────────────────────────

/** Determinate fill at several points across a build's lifecycle. */
export const Values: Story = {
	render: () => {
		const stages = [
			{ value: 0, label: "Queued" },
			{ value: 25, label: "Pulling base image" },
			{ value: 50, label: "Installing dependencies" },
			{ value: 75, label: "Running steps" },
			{ value: 100, label: "Complete" },
		];
		return (
			<div className="flex w-80 flex-col gap-6">
				{stages.map((stage) => (
					<Progress key={stage.value} value={stage.value}>
						<ProgressLabel>{stage.label}</ProgressLabel>
						<ProgressValue />
					</Progress>
				))}
			</div>
		);
	},
};

// ─── Indeterminate ────────────────────────────────────────────────────────────

/**
 * value={null} puts the bar in its indeterminate state: no fill, and the
 * progressbar is announced as busy to screen readers. Use it while a total is
 * still unknown, e.g. before the step count of a run is resolved.
 */
export const Indeterminate: Story = {
	render: () => (
		<div className="w-80">
			<Progress value={null}>
				<ProgressLabel>Resolving run graph</ProgressLabel>
			</Progress>
		</div>
	),
};

// ─── Custom range ─────────────────────────────────────────────────────────────

/**
 * A custom max plus a `ProgressValue` render prop shows absolute counts instead
 * of a percentage — here, completed steps out of the total.
 */
export const CustomRange: Story = {
	render: () => (
		<div className="w-80">
			<Progress value={7} max={12}>
				<ProgressLabel>Pipeline steps</ProgressLabel>
				<ProgressValue>
					{(_formatted, value) => `${value} / 12 steps`}
				</ProgressValue>
			</Progress>
		</div>
	),
};

// ─── Composed (run progress card) ─────────────────────────────────────────────

/**
 * Several labeled progress rows inside a Card — a run-status tile where earlier
 * stages have completed and the current stage is mid-flight.
 */
export const Composed: Story = {
	render: () => {
		const rows = [
			{ label: "Downloading dataset", value: 100 },
			{ label: "Building Docker image", value: 100 },
			{ label: "Training epoch 7 / 10", value: 70 },
			{ label: "Evaluating checkpoints", value: 0 },
		];
		return (
			<Card className="w-96">
				<CardHeader>
					<CardTitle>Run progress</CardTitle>
					<CardDescription>training_pipeline · started 4m ago</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
					{rows.map((row) => (
						<Progress key={row.label} value={row.value}>
							<ProgressLabel>{row.label}</ProgressLabel>
							<ProgressValue />
						</Progress>
					))}
				</CardContent>
			</Card>
		);
	},
};
