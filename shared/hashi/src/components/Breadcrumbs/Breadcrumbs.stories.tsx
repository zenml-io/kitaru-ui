import type { Meta, StoryObj } from "@storybook/react-vite";

import { Breadcrumbs, type BreadcrumbItemData } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
	title: "Components/Breadcrumbs",
	component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

// ---------------------------------------------------------------------------
// Shared fixture data
// ---------------------------------------------------------------------------

const pipelineDetailCrumbs: BreadcrumbItemData[] = [
	{ key: "flows", label: "Flows", labelRender: <a href="#" /> },
	{
		key: "flow-detail",
		label: "checkout-pipeline",
		labelRender: <a href="#" />,
	},
	{ key: "current", label: "v1.2.3", isCurrent: true },
];

const executionDetailCrumbs: BreadcrumbItemData[] = [
	{ key: "runs", label: "Runs", labelRender: <a href="#" /> },
	{
		key: "pipeline",
		label: "training-pipeline",
		labelRender: <a href="#" />,
	},
	{ key: "current", label: "Execution #2048", isCurrent: true },
];

const withDisabledCrumbs: BreadcrumbItemData[] = [
	{ key: "root", label: "Flows", labelRender: <a href="#" /> },
	{ key: "disabled", label: "Archived", isDisabled: true },
	{ key: "leaf", label: "old-pipeline", isCurrent: true },
];

const withTrailingCrumbs: BreadcrumbItemData[] = [
	{ key: "flows", label: "Flows", labelRender: <a href="#" /> },
	{
		key: "flow-detail",
		label: "checkout-pipeline",
		labelRender: <a href="#" />,
		trailing: (
			<span className="bg-accent/40 text-foreground ml-1 inline-flex h-5 items-center rounded-md px-1.5 text-xs">
				v1.2.3
			</span>
		),
	},
	{ key: "current", label: "Execution #42", isCurrent: true },
];

const textOnlyMidCrumbs: BreadcrumbItemData[] = [
	{ key: "flows", label: "Flows", labelRender: <a href="#" /> },
	{ key: "text", label: "non-navigable label" },
	{ key: "current", label: "leaf", isCurrent: true },
];

const singleCrumb: BreadcrumbItemData[] = [
	{ key: "current", label: "Production traces", isCurrent: true },
];

const longLabelCrumbs: BreadcrumbItemData[] = [
	{ key: "ws", label: "zenml-eu-central", labelRender: <a href="#" /> },
	{
		key: "project",
		label: "recommender-system-feature-engineering",
		labelRender: <a href="#" />,
	},
	{
		key: "current",
		label: "very-long-pipeline-name-that-tests-truncation-behaviour-in-navbars",
		isCurrent: true,
	},
];

// ---------------------------------------------------------------------------
// Default — args-driven playground
// ---------------------------------------------------------------------------

export const Default: Story = {
	args: {
		items: pipelineDetailCrumbs,
	},
};

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

export const States: Story = {
	parameters: {
		a11y: {
			config: {
				rules: [{ id: "landmark-unique", enabled: false }],
			},
		},
	},
	render: () => (
		<div className="flex flex-col gap-6">
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
					Standard (last crumb is current page)
				</p>
				<Breadcrumbs items={pipelineDetailCrumbs} />
			</div>

			<div>
				<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
					Execution detail
				</p>
				<Breadcrumbs items={executionDetailCrumbs} />
			</div>

			<div>
				<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
					Disabled mid-crumb (isDisabled)
				</p>
				<Breadcrumbs items={withDisabledCrumbs} />
			</div>

			<div>
				<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
					Text-only mid-crumb (no labelRender)
				</p>
				<Breadcrumbs items={textOnlyMidCrumbs} />
			</div>

			<div>
				<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
					Single item (no separator rendered)
				</p>
				<Breadcrumbs items={singleCrumb} />
			</div>
		</div>
	),
};

// ---------------------------------------------------------------------------
// WithTrailingSlot
// ---------------------------------------------------------------------------

export const WithTrailingSlot: Story = {
	name: "With Trailing Slot",
	render: () => (
		<div className="flex flex-col gap-3">
			<p className="text-muted-foreground text-xs">
				The <code>trailing</code> prop renders inside the BreadcrumbItem after
				the label, before the next separator. Use it for version switcher pills
				or inline action menus attached to a specific crumb.
			</p>
			<Breadcrumbs items={withTrailingCrumbs} />
		</div>
	),
};

// ---------------------------------------------------------------------------
// LongLabels — truncation behaviour
// ---------------------------------------------------------------------------

export const LongLabels: Story = {
	name: "Long Labels",
	render: () => (
		<div className="flex flex-col gap-3">
			<p className="text-muted-foreground text-xs">
				Labels overflow naturally; the consumer is responsible for clamping or
				truncating. This story shows unconstrained overflow so consumers can
				decide on a max-width policy.
			</p>
			<Breadcrumbs items={longLabelCrumbs} />
		</div>
	),
};

// ---------------------------------------------------------------------------
// Composed — realistic navbar context
// ---------------------------------------------------------------------------

export const Composed: Story = {
	name: "Composed — Navbar Context",
	render: () => (
		<div className="bg-card border-border flex h-12 items-center gap-2 rounded-lg border px-4">
			<nav className="flex min-w-0 flex-1 items-center">
				<Breadcrumbs
					items={[
						{
							key: "ws",
							label: "zenml-eu-central",
							labelRender: <a href="#" />,
						},
						{
							key: "project",
							label: "production-traces",
							labelRender: <a href="#" />,
						},
						{ key: "current", label: "checkout-pipeline", isCurrent: true },
					]}
				/>
			</nav>
		</div>
	),
};
