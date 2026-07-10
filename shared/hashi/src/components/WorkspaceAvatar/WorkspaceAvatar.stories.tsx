import type { Meta, StoryObj } from "@storybook/react-vite";

import { WorkspaceAvatar } from "./WorkspaceAvatar";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const ZENML_WORKSPACES = [
	{
		slug: "zenml-eu-central",
		type: "zenml" as const,
		name: "ZenML EU Central",
	},
	{
		slug: "production-traces",
		type: "zenml" as const,
		name: "Production Traces",
	},
	{
		slug: "staging-pipeline",
		type: "zenml" as const,
		name: "Staging Pipeline",
	},
	{ slug: "research-lab", type: "zenml" as const, name: "Research Lab" },
];

const KITARU_WORKSPACES = [
	{ slug: "kitaru-prod", type: "kitaru" as const, name: "Kitaru Production" },
	{ slug: "kitaru-dev", type: "kitaru" as const, name: "Kitaru Dev" },
	{ slug: "ml-inference", type: "kitaru" as const, name: "ML Inference" },
	{ slug: "data-platform", type: "kitaru" as const, name: "Data Platform" },
];

const SAMPLE_ZENML = ZENML_WORKSPACES[0]!;
const SAMPLE_KITARU = KITARU_WORKSPACES[0]!;

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof WorkspaceAvatar> = {
	title: "Components/WorkspaceAvatar",
	component: WorkspaceAvatar,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=89-13",
		},
	},
	args: {
		workspace: SAMPLE_ZENML,
		size: "2xl",
	},
	argTypes: {
		size: {
			control: "select",
			options: ["default", "lg", "xl", "2xl"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof WorkspaceAvatar>;

// ─── Default (args-driven) ────────────────────────────────────────────────────

export const Default: Story = {};

// ─── Type variants ────────────────────────────────────────────────────────────
// ZenML workspaces use a green gradient; Kitaru workspaces use an orange/terracotta
// gradient. The color is type-anchored — it never follows the page's brand theme.

export const TypeVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div>
				<p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
					ZenML type — green gradient
				</p>
				<div className="flex flex-wrap items-center gap-4">
					<WorkspaceAvatar workspace={SAMPLE_ZENML} size="2xl" />
				</div>
			</div>
			<div>
				<p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
					Kitaru type — orange gradient
				</p>
				<div className="flex flex-wrap items-center gap-4">
					<WorkspaceAvatar workspace={SAMPLE_KITARU} size="2xl" />
				</div>
			</div>
		</div>
	),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div>
				<p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
					ZenML workspace — all sizes
				</p>
				<div className="flex flex-wrap items-end gap-5">
					{(["default", "lg", "xl", "2xl"] as const).map((size) => (
						<div key={size} className="flex flex-col items-center gap-2">
							<WorkspaceAvatar workspace={SAMPLE_ZENML} size={size} />
							<span className="text-muted-foreground font-mono text-xs">
								{size}
							</span>
						</div>
					))}
				</div>
			</div>
			<div>
				<p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
					Kitaru workspace — all sizes
				</p>
				<div className="flex flex-wrap items-end gap-5">
					{(["default", "lg", "xl", "2xl"] as const).map((size) => (
						<div key={size} className="flex flex-col items-center gap-2">
							<WorkspaceAvatar workspace={SAMPLE_KITARU} size={size} />
							<span className="text-muted-foreground font-mono text-xs">
								{size}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	),
};

// ─── Slug hue rotation ────────────────────────────────────────────────────────
// Each workspace gets a ±12° hue-rotate offset derived from its slug, so siblings
// in a list are visually distinguishable while staying within the brand family.

export const SlugHueRotation: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div>
				<p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
					ZenML workspaces — unique hue per slug
				</p>
				<div className="flex flex-wrap items-center gap-4">
					{ZENML_WORKSPACES.map((w) => (
						<div key={w.slug} className="flex flex-col items-center gap-2">
							<WorkspaceAvatar workspace={w} size="xl" />
							<span className="text-muted-foreground max-w-20 truncate font-mono text-xs">
								{w.slug}
							</span>
						</div>
					))}
				</div>
			</div>
			<div>
				<p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
					Kitaru workspaces — unique hue per slug
				</p>
				<div className="flex flex-wrap items-center gap-4">
					{KITARU_WORKSPACES.map((w) => (
						<div key={w.slug} className="flex flex-col items-center gap-2">
							<WorkspaceAvatar workspace={w} size="xl" />
							<span className="text-muted-foreground max-w-20 truncate font-mono text-xs">
								{w.slug}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	),
};

// ─── With image override ──────────────────────────────────────────────────────
// When imageUrl is provided, it renders over the gradient fallback.
// The gradient is still visible if the image fails to load.

export const WithImage: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-5">
			<div className="flex flex-col items-center gap-2">
				<WorkspaceAvatar
					workspace={SAMPLE_ZENML}
					size="2xl"
					imageUrl="https://i.pravatar.cc/150?u=workspace-zenml"
				/>
				<span className="text-muted-foreground font-mono text-xs">
					image loaded
				</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<WorkspaceAvatar
					workspace={SAMPLE_ZENML}
					size="2xl"
					imageUrl="/this-image-does-not-exist.png"
				/>
				<span className="text-muted-foreground font-mono text-xs">
					image error → gradient
				</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<WorkspaceAvatar workspace={SAMPLE_ZENML} size="2xl" />
				<span className="text-muted-foreground font-mono text-xs">
					no image → gradient
				</span>
			</div>
		</div>
	),
};

// ─── Composed: workspace identity card ────────────────────────────────────────
// Real-world usage: the avatar sits next to the workspace name and type in
// a card header or a switcher pill's expanded panel.

export const ComposedWorkspaceCard: Story = {
	render: () => (
		<div className="border-border bg-card flex w-72 flex-col gap-3 rounded-lg border p-4">
			{[...ZENML_WORKSPACES.slice(0, 2), ...KITARU_WORKSPACES.slice(0, 2)].map(
				(w) => (
					<div key={w.slug} className="flex items-center gap-3">
						<WorkspaceAvatar workspace={w} size="lg" />
						<div className="min-w-0 flex-1">
							<p className="text-foreground truncate text-sm font-medium">
								{w.name}
							</p>
							<p className="text-muted-foreground truncate font-mono text-xs">
								{w.slug}
							</p>
						</div>
						<span className="text-muted-foreground text-xs capitalize">
							{w.type}
						</span>
					</div>
				)
			)}
		</div>
	),
};

// ─── Long slug edge case ──────────────────────────────────────────────────────
// Verifies the hue hash function handles very short and very long slugs without
// crashing or producing a NaN filter value.

export const SlugEdgeCases: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-5">
			{[
				{ slug: "a", type: "zenml" as const, name: "a" },
				{ slug: "ab", type: "kitaru" as const, name: "ab" },
				{
					slug: "zenml-production-eu-west-1-enterprise-cluster-primary",
					type: "zenml" as const,
					name: "Long slug ZenML",
				},
				{
					slug: "kitaru-ml-inference-us-east-2-prod-green",
					type: "kitaru" as const,
					name: "Long slug Kitaru",
				},
			].map((w) => (
				<div key={w.slug} className="flex flex-col items-center gap-2">
					<WorkspaceAvatar workspace={w} size="xl" />
					<span className="text-muted-foreground max-w-24 truncate font-mono text-xs">
						{w.slug}
					</span>
				</div>
			))}
		</div>
	),
};
