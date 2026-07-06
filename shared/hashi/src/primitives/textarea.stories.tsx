import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";

/**
 * Multi-line text field. It is a thin wrapper over the native `<textarea>`, so
 * it accepts every textarea prop (`rows`, `placeholder`, `disabled`, `value`,
 * `aria-invalid`, …) and grows with its content via `field-sizing-content`. No
 * drop shadow — definition comes from the border and focus ring. Always give it
 * an accessible name via an associated `Label` or `aria-label`.
 */
const meta: Meta<typeof Textarea> = {
	title: "Primitives/Textarea",
	component: Textarea,
	args: {
		placeholder: "Describe why you're re-running this flow",
		rows: 4,
		disabled: false,
	},
	argTypes: {
		rows: { control: { type: "number", min: 1, max: 16 } },
		disabled: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof Textarea>;

// ─── Default (args-driven) ────────────────────────────────────────────────────

export const Default: Story = {
	render: (args) => (
		<div className="w-96">
			<Textarea aria-label="Replay notes" {...args} />
		</div>
	),
};

// ─── Rows ─────────────────────────────────────────────────────────────────────

/** The `rows` attribute sets the initial height; content can grow past it. */
export const Rows: Story = {
	render: () => (
		<div className="flex w-96 flex-col gap-4">
			<Textarea
				aria-label="Two rows"
				rows={2}
				placeholder="Short note (2 rows)"
			/>
			<Textarea
				aria-label="Four rows"
				rows={4}
				placeholder="Default note (4 rows)"
			/>
			<Textarea
				aria-label="Eight rows"
				rows={8}
				placeholder="Long description (8 rows)"
			/>
		</div>
	),
};

// ─── States ───────────────────────────────────────────────────────────────────

export const States: Story = {
	render: () => (
		<div className="flex w-96 flex-col gap-4">
			<Textarea aria-label="Empty" placeholder="Empty, placeholder shown" />
			<Textarea
				aria-label="Filled"
				defaultValue="Re-running with the patched prompt template to confirm the eval regression is fixed."
			/>
			<Textarea
				aria-label="Disabled"
				disabled
				defaultValue="Locked while the replay is queued."
			/>
			<Textarea
				aria-label="Invalid"
				aria-invalid="true"
				placeholder="This field is required"
			/>
		</div>
	),
};

// ─── With label ───────────────────────────────────────────────────────────────

/** Paired with a Label via htmlFor plus helper text — the standard form row. */
export const WithLabel: Story = {
	render: () => (
		<div className="flex w-96 flex-col gap-1.5">
			<Label htmlFor="run-notes">Run notes</Label>
			<Textarea
				id="run-notes"
				rows={4}
				placeholder="Add context for this replay"
			/>
			<p className="text-muted-foreground text-xs">
				Shown on the execution timeline. Markdown is supported.
			</p>
		</div>
	),
};

// ─── Error state ──────────────────────────────────────────────────────────────

/** aria-invalid plus an aria-describedby hint for the validation message. */
export const ErrorState: Story = {
	render: () => (
		<div className="flex w-96 flex-col gap-1.5">
			<Label htmlFor="override-summary">Override summary</Label>
			<Textarea
				id="override-summary"
				rows={3}
				aria-invalid="true"
				aria-describedby="override-error"
				placeholder="Summarize the override"
			/>
			<p id="override-error" className="text-destructive text-xs">
				A summary is required before starting the replay.
			</p>
		</div>
	),
};

// ─── Composed (start-replay form) ─────────────────────────────────────────────

/**
 * A realistic form combining Label, Input, and Textarea inside a Card — the
 * start-replay dialog where the run is named and a reason is captured.
 */
export const Composed: Story = {
	render: () => (
		<Card className="w-96">
			<CardHeader>
				<CardTitle>Start replay</CardTitle>
				<CardDescription>
					fraud-detection · re-running from checkpoint "embed-features"
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-5">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="replay-name">Run name</Label>
					<Input id="replay-name" defaultValue="fraud-detection-replay-3" />
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="replay-reason">Reason for replay</Label>
					<Textarea
						id="replay-reason"
						rows={4}
						defaultValue="Patched the feature-store connector timeout. Confirming the eval step no longer flakes on cold reads."
					/>
					<p className="text-muted-foreground text-xs">
						Saved with the run so reviewers can see why it was triggered.
					</p>
				</div>
			</CardContent>
		</Card>
	),
};
