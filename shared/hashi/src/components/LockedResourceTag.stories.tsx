import type { Meta, StoryObj } from "@storybook/react-vite";

import { LockedResourceTag } from "./LockedResourceTag";

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * A monospace tag standing in for a resource the current user cannot access. It
 * shows a lock glyph and the resource name, truncating within its container,
 * and carries a tooltip explaining the missing access. Used wherever a table
 * cell or chip would otherwise render a name the viewer lacks permission to
 * open — flows, executions, stack components, and tags.
 */
const meta: Meta<typeof LockedResourceTag> = {
	title: "Components/LockedResourceTag",
	component: LockedResourceTag,
	args: {
		name: "s3-artifact-store",
	},
};

export default meta;
type Story = StoryObj<typeof LockedResourceTag>;

// ─── Default (args-driven) ────────────────────────────────────────────────────

export const Default: Story = {};

// ─── Truncation ───────────────────────────────────────────────────────────────
// The tag fills its container and truncates a long name; the full value stays
// available through the tooltip on hover / focus.

export const Truncated: Story = {
	render: () => (
		<div className="w-44">
			<LockedResourceTag name="production-embeddings-artifact-store-eu-central" />
		</div>
	),
};

// ─── Sizes side by side ───────────────────────────────────────────────────────
// Short and long names at their natural width, so the fixed height and lock
// glyph read consistently regardless of label length.

export const Names: Story = {
	render: () => (
		<div className="flex flex-col items-start gap-2">
			<LockedResourceTag name="default" />
			<LockedResourceTag name="gcp-vertex-orchestrator" />
			<LockedResourceTag name="mlflow-experiment-tracker" />
		</div>
	),
};

// ─── Composed: flows table ────────────────────────────────────────────────────
// A flows list where some rows resolve to a name and one is access-restricted —
// the locked row swaps its name cell for the tag, keeping the row aligned.

export const Composed: Story = {
	render: () => (
		<div className="border-border w-80 divide-y rounded-lg border text-sm">
			{[
				{ name: "daily-batch-scoring", locked: false },
				{ name: "customer-churn-training", locked: true },
				{ name: "feature-backfill", locked: false },
				{ name: "nightly-embeddings-refresh", locked: true },
			].map((row) => (
				<div
					key={row.name}
					className="flex items-center justify-between gap-3 px-3 py-2"
				>
					{row.locked ? (
						<LockedResourceTag name={row.name} />
					) : (
						<span className="text-foreground truncate font-medium">
							{row.name}
						</span>
					)}
					<span className="text-muted-foreground shrink-0 text-xs">
						{row.locked ? "No access" : "2h ago"}
					</span>
				</div>
			))}
		</div>
	),
};
