import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Database,
	FileText,
	Info,
	LayoutGrid,
	Package,
	ScrollText,
	Search,
	Workflow,
} from "lucide-react";

import { Button } from "../button/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "./empty";

const meta: Meta<typeof Empty> = {
	title: "Primitives/Empty",
	component: Empty,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=86-5",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Empty>;

// ---------------------------------------------------------------------------
// Default — minimal usage wired to args
// ---------------------------------------------------------------------------

export const Default: Story = {
	render: () => (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<LayoutGrid />
				</EmptyMedia>
				<EmptyTitle>Nothing here yet</EmptyTitle>
				<EmptyDescription>
					Create your first item to get started.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	),
};

// ---------------------------------------------------------------------------
// MediaVariants — default (transparent) vs icon (muted tinted box)
// ---------------------------------------------------------------------------

export const MediaVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-1">
				<p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
					variant=&quot;default&quot; — transparent, any content
				</p>
				<Empty className="border-dashed">
					<EmptyHeader>
						<EmptyMedia variant="default">
							<span className="text-muted-foreground/75 font-mono text-7xl font-bold tabular-nums select-none">
								404
							</span>
						</EmptyMedia>
						<EmptyTitle>Page not found</EmptyTitle>
						<EmptyDescription>
							The URL may have changed. Check the address or head back home.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</div>

			<div className="flex flex-col gap-1">
				<p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
					variant=&quot;icon&quot; — muted rounded container, 24px icon
				</p>
				<Empty className="border-dashed">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Package />
						</EmptyMedia>
						<EmptyTitle>No deployments yet</EmptyTitle>
						<EmptyDescription>
							Ship this flow to a stack to create the default deployment.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</div>
		</div>
	),
};

// ---------------------------------------------------------------------------
// HeaderOnly — when no actions are needed (e.g. inline panel idle state)
// ---------------------------------------------------------------------------

export const HeaderOnly: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<Empty className="border-dashed">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Info />
					</EmptyMedia>
					<EmptyDescription>Select a span to view details</EmptyDescription>
				</EmptyHeader>
			</Empty>

			<Empty className="border-dashed">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ScrollText />
					</EmptyMedia>
					<EmptyDescription>No logs available for this run</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	),
};

// ---------------------------------------------------------------------------
// WithContent — header + call-to-action slot below
// ---------------------------------------------------------------------------

export const WithContent: Story = {
	render: () => (
		<Empty className="border-dashed">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Database />
				</EmptyMedia>
				<EmptyTitle>No artifacts produced</EmptyTitle>
				<EmptyDescription>
					Artifacts are logged when a step calls{" "}
					<a href="#artifacts">save_artifact()</a>. None were recorded in this
					run.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<a
					href="#docs"
					className="text-foreground hover:text-primary inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"
				>
					Read the artifacts guide
				</a>
			</EmptyContent>
		</Empty>
	),
};

// ---------------------------------------------------------------------------
// NoBorder — used when Empty fills a panel that already has a border
// ---------------------------------------------------------------------------

export const NoBorder: Story = {
	render: () => (
		<div className="border-border rounded-lg border">
			<Empty className="border-none">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Workflow />
					</EmptyMedia>
					<EmptyTitle>No pipeline runs</EmptyTitle>
					<EmptyDescription>
						Trigger a run from the CLI or the ZenML dashboard to see results
						here.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	),
};

// ---------------------------------------------------------------------------
// LongText — wrapping/balance behaviour under a narrow container
// ---------------------------------------------------------------------------

export const LongText: Story = {
	render: () => (
		<div className="mx-auto max-w-xs">
			<Empty className="border-dashed">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<FileText />
					</EmptyMedia>
					<EmptyTitle>
						No production traces found for zenml-eu-central in the last 30 days
					</EmptyTitle>
					<EmptyDescription>
						Traces appear once your pipeline reports spans to the collector.
						Make sure the instrumentation layer is configured correctly and that
						the collector endpoint is reachable from your execution environment.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	),
};

// ---------------------------------------------------------------------------
// Composed — realistic full-page zero-state (search returned no results)
// ---------------------------------------------------------------------------

export const Composed: Story = {
	render: () => (
		<div className="bg-background flex min-h-[480px] items-center justify-center rounded-lg p-8">
			<Empty className="max-w-md border-dashed">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Search />
					</EmptyMedia>
					<EmptyTitle>No pipelines matched your search</EmptyTitle>
					<EmptyDescription>
						Try a different keyword or clear the filters to browse all pipelines
						in the <strong>zenml-eu-central</strong> workspace.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<div className="flex flex-wrap items-center justify-center gap-3">
						<Button>Clear filters</Button>
						<Button variant="outline">Browse all pipelines</Button>
					</div>
				</EmptyContent>
			</Empty>
		</div>
	),
};
