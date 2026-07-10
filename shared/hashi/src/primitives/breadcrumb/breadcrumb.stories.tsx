import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, Layers, GitBranch } from "lucide-react";

import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbEllipsis,
} from "./breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
	title: "Primitives/Breadcrumb",
	component: Breadcrumb,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=85-5",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

// ---------------------------------------------------------------------------
// Default — three-level trail, last item is the current page
// ---------------------------------------------------------------------------
export const Default: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Flows</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">checkout-pipeline</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>v1.2.3</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

// ---------------------------------------------------------------------------
// Lengths — one, two, three, and four crumbs
// ---------------------------------------------------------------------------
export const Lengths: Story = {
	render: () => (
		<div className="flex flex-col gap-5">
			{/* Single — nothing to navigate up to */}
			<Breadcrumb aria-label="breadcrumb single">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage>Production traces</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Two levels */}
			<Breadcrumb aria-label="breadcrumb two levels">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#">Stacks</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>zenml-eu-central</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Three levels */}
			<Breadcrumb aria-label="breadcrumb three levels">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#">Pipelines</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="#">training-pipeline</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Run #847</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Four levels */}
			<Breadcrumb aria-label="breadcrumb four levels">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#">Org</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="#">zenml-prod</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="#">Flows</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>checkout-pipeline</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	),
};

// ---------------------------------------------------------------------------
// Separators — default chevron vs slash (used in topnav)
// ---------------------------------------------------------------------------
export const Separators: Story = {
	render: () => (
		<div className="flex flex-col gap-5">
			{/* Default: chevron icon */}
			<div>
				<p className="text-muted-foreground mb-2 text-xs">Chevron (default)</p>
				<Breadcrumb aria-label="breadcrumb chevron">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#">Flows</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>checkout-pipeline</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			{/* Slash: used in top-navbar breadcrumbs */}
			<div>
				<p className="text-muted-foreground mb-2 text-xs">
					Slash (top-navbar style)
				</p>
				<Breadcrumb aria-label="breadcrumb slash">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#">zenml-prod</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator>
							<span
								aria-hidden
								className="text-border text-base font-light select-none"
							>
								/
							</span>
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbLink href="#">training-pipeline</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator>
							<span
								aria-hidden
								className="text-border text-base font-light select-none"
							>
								/
							</span>
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbPage>Run #847</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</div>
	),
};

// ---------------------------------------------------------------------------
// WithEllipsis — collapsed middle for deep trails
// ---------------------------------------------------------------------------
export const WithEllipsis: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbEllipsis />
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">artifact-stores</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>s3-prod-eu</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

// ---------------------------------------------------------------------------
// WithIcons — icon prepended to first crumb
// ---------------------------------------------------------------------------
export const WithIcons: Story = {
	render: () => (
		<div className="flex flex-col gap-5">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#" className="flex items-center gap-1.5">
							<Home className="size-3.5" />
							Home
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="#" className="flex items-center gap-1.5">
							<Layers className="size-3.5" />
							Stacks
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage className="flex items-center gap-1.5">
							<GitBranch className="size-3.5" />
							zenml-eu-central
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	),
};

// ---------------------------------------------------------------------------
// States — disabled mid-crumb, text-only mid-crumb
// ---------------------------------------------------------------------------
export const States: Story = {
	render: () => (
		<div className="flex flex-col gap-5">
			{/* Disabled mid-crumb (treated as non-navigable BreadcrumbPage) */}
			<div>
				<p className="text-muted-foreground mb-2 text-xs">
					Disabled / non-navigable mid-crumb
				</p>
				<Breadcrumb aria-label="breadcrumb disabled">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#">Flows</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							{/* No href — renders as static text, not a link */}
							<BreadcrumbPage>Archived</BreadcrumbPage>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>old-pipeline</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			{/* Current crumb with bold weight (semibold) */}
			<div>
				<p className="text-muted-foreground mb-2 text-xs">
					Current crumb — semibold
				</p>
				<Breadcrumb aria-label="breadcrumb semibold">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#">Pipelines</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className="font-semibold">
								training-pipeline
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			{/* Monospace execution ID */}
			<div>
				<p className="text-muted-foreground mb-2 text-xs">
					Monospace execution id (font-mono)
				</p>
				<Breadcrumb aria-label="breadcrumb monospace">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#">Flows</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="#">checkout-pipeline</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className="font-mono text-sm font-semibold">
								Exec #1042
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</div>
	),
};

// ---------------------------------------------------------------------------
// WithTrailingSlot — inline pill/switcher attached to a crumb
// ---------------------------------------------------------------------------
export const WithTrailingSlot: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Flows</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">checkout-pipeline</BreadcrumbLink>
					{/* trailing: inline version switcher pill */}
					<span className="bg-accent/40 text-foreground ml-1 inline-flex h-5 items-center rounded-md px-1.5 text-xs">
						v1.2.3
					</span>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Execution #42</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

// ---------------------------------------------------------------------------
// PolymorphicLink — render prop swaps the anchor for any element
// ---------------------------------------------------------------------------
export const PolymorphicLink: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<p className="text-muted-foreground text-xs">
				<code>BreadcrumbLink</code> accepts a <code>render</code> prop to swap
				the underlying element — e.g. a router Link, a button, or a span.
			</p>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						{/* render as a <button> instead of <a> */}
						<BreadcrumbLink render={<button type="button" />}>
							Pipelines
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						{/* render as a plain <span> (non-navigable) */}
						<BreadcrumbLink render={<span />}>training-pipeline</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Run #847</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	),
};

// ---------------------------------------------------------------------------
// LongText — truncation in constrained containers
// ---------------------------------------------------------------------------
export const LongText: Story = {
	render: () => (
		<div className="w-96 overflow-hidden">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#">Org</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="#" className="max-w-40 truncate">
							very-long-workspace-name-that-overflows
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage className="max-w-32 truncate">
							extremely-long-pipeline-name-that-also-overflows
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	),
};

// ---------------------------------------------------------------------------
// Composed — realistic top-navbar breadcrumb in a shell frame
// ---------------------------------------------------------------------------
export const Composed: Story = {
	render: () => (
		<div className="bg-card border-border flex h-12 items-center gap-3 border-b px-4">
			{/* Simulated org mark */}
			<div className="bg-primary size-6 rounded" aria-hidden="true" />
			<span className="text-muted-foreground text-sm">/</span>

			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#" className="text-sm font-medium">
							zenml-prod
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>
						<span
							aria-hidden
							className="text-border text-base font-light select-none"
						>
							/
						</span>
					</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbLink href="#" className="text-sm font-medium">
							checkout-pipeline
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>
						<span
							aria-hidden
							className="text-border text-base font-light select-none"
						>
							/
						</span>
					</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbPage className="font-mono text-sm font-semibold">
							Exec #1042
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	),
};
