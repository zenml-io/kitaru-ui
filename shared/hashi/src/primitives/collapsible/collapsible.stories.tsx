import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
	ChevronDown,
	ChevronRight,
	Copy,
	Check,
	Settings2,
} from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./collapsible";

const meta: Meta<typeof Collapsible> = {
	title: "Primitives/Collapsible",
	component: Collapsible,
	args: {
		defaultOpen: true,
	},
	argTypes: {
		defaultOpen: { control: "boolean" },
		disabled: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

// ---------------------------------------------------------------------------
// Default — driven by args, minimal chrome
// ---------------------------------------------------------------------------
export const Default: Story = {
	render: (args) => (
		<Collapsible {...args} className="w-80">
			<CollapsibleTrigger className="border-border bg-secondary text-foreground hover:bg-secondary/80 group/collapse flex w-full cursor-pointer items-center justify-between rounded-md border px-4 py-2.5 text-left text-sm font-medium transition-colors">
				Toggle section
				<ChevronDown className="text-muted-foreground size-4 transition-transform group-data-[panel-open]/collapse:rotate-180" />
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="border-border bg-card text-muted-foreground mt-1 rounded-md border px-4 py-3 text-sm">
					Hidden content revealed when the trigger is activated.
				</div>
			</CollapsibleContent>
		</Collapsible>
	),
};

// ---------------------------------------------------------------------------
// Controlled — consumer manages open state externally
// ---------------------------------------------------------------------------
export const Controlled: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<div className="flex w-80 flex-col gap-3">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => setOpen((v) => !v)}
						className="border-border bg-card text-foreground hover:bg-secondary rounded-md border px-3 py-1.5 text-xs transition-colors"
					>
						{open ? "Collapse" : "Expand"} externally
					</button>
					<span className="text-muted-foreground text-xs tabular-nums">
						open: {String(open)}
					</span>
				</div>
				<Collapsible open={open} onOpenChange={setOpen}>
					<CollapsibleTrigger className="border-border bg-secondary text-foreground hover:bg-secondary/80 flex w-full cursor-pointer items-center justify-between rounded-md border px-4 py-2.5 text-left text-sm font-medium transition-colors">
						Pipeline config
						<ChevronDown
							className="text-muted-foreground size-4 transition-transform"
							style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
						/>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="border-border bg-card text-muted-foreground mt-1 space-y-1 rounded-md border px-4 py-3 font-mono text-xs">
							<div className="flex justify-between">
								<span>schedule</span>
								<span className="text-foreground">0 */6 * * *</span>
							</div>
							<div className="flex justify-between">
								<span>timeout_seconds</span>
								<span className="text-foreground">3600</span>
							</div>
							<div className="flex justify-between">
								<span>retry_on_failure</span>
								<span className="text-foreground">true</span>
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>
		);
	},
};

// ---------------------------------------------------------------------------
// TriggerVariants — different trigger visual styles used across the codebase
// ---------------------------------------------------------------------------
export const TriggerVariants: Story = {
	render: () => (
		<div className="flex w-96 flex-col gap-4">
			{/* Outlined card header */}
			<div>
				<p className="text-2xs text-muted-foreground mb-1.5 font-medium tracking-wider uppercase">
					Outlined card header
				</p>
				<Collapsible
					defaultOpen
					className="border-border overflow-hidden rounded-lg border"
				>
					<CollapsibleTrigger className="bg-secondary data-[open]:border-border group/collapse flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left transition-all hover:brightness-[0.98] data-[open]:border-b">
						<ChevronDown className="text-muted-foreground size-3.5 shrink-0 -rotate-90 transition-transform group-data-[panel-open]/collapse:rotate-0" />
						<span className="text-foreground text-xs font-medium">
							Stack Components
						</span>
						<span className="text-2xs text-muted-foreground ml-auto tabular-nums">
							4 components
						</span>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="bg-card text-muted-foreground px-4 py-3 text-xs">
							kubeflow · s3-zenfiles · aws-ecr-eu · mlflow
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>

			{/* Section label with divider line */}
			<div>
				<p className="text-2xs text-muted-foreground mb-1.5 font-medium tracking-wider uppercase">
					Section label + divider
				</p>
				<Collapsible defaultOpen>
					<CollapsibleTrigger className="group/collapse flex w-full cursor-pointer items-center gap-1.5 px-0 py-2 text-left">
						<ChevronDown className="text-muted-foreground size-3.5 shrink-0 -rotate-90 transition-transform group-data-[panel-open]/collapse:rotate-0" />
						<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
							Docker Image
						</span>
						<span className="bg-border ml-2 h-px flex-1" />
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="text-muted-foreground space-y-1 pb-2 pl-5 text-xs">
							<div className="flex justify-between">
								<span>Image</span>
								<span className="text-foreground font-mono">
									eu.gcr.io/zenml/runner:1.4.2
								</span>
							</div>
							<div className="flex justify-between">
								<span>Registry</span>
								<span className="text-foreground font-mono">aws-ecr-eu</span>
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>

			{/* Chevron-right style (rotates to down when open) */}
			<div>
				<p className="text-2xs text-muted-foreground mb-1.5 font-medium tracking-wider uppercase">
					Chevron-right rotates to down
				</p>
				<Collapsible defaultOpen>
					<CollapsibleTrigger className="hover:bg-secondary group/collapse flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors">
						<ChevronRight className="text-muted-foreground size-4 shrink-0 transition-transform group-data-[panel-open]/collapse:rotate-90" />
						<Settings2 className="text-muted-foreground size-4 shrink-0" />
						<span className="text-foreground text-sm">Advanced settings</span>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="border-border bg-card text-muted-foreground mt-1 ml-8 rounded-md border px-3 py-2 text-xs">
							max_parallelism: 4 · enable_cache: true
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>
		</div>
	),
};

// ---------------------------------------------------------------------------
// DefaultClosed — starts collapsed; common for secondary/optional sections
// ---------------------------------------------------------------------------
export const DefaultClosed: Story = {
	render: () => (
		<Collapsible
			defaultOpen={false}
			className="border-border w-80 overflow-hidden rounded-lg border"
		>
			<CollapsibleTrigger className="bg-secondary data-[open]:border-border group/collapse flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left transition-all hover:brightness-[0.98] data-[open]:border-b">
				<ChevronDown className="text-muted-foreground size-3.5 shrink-0 -rotate-90 transition-transform group-data-[panel-open]/collapse:rotate-0" />
				<span className="text-foreground text-xs font-medium">
					Environment variables
				</span>
				<span className="text-2xs text-muted-foreground ml-auto">
					8 variables
				</span>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="bg-card text-muted-foreground px-4 py-3 font-mono text-xs">
					ZENML_SERVER_URL · AWS_REGION · S3_BUCKET · ...
				</div>
			</CollapsibleContent>
		</Collapsible>
	),
};

// ---------------------------------------------------------------------------
// Disabled — trigger is inert; open/closed state cannot be toggled
// ---------------------------------------------------------------------------
export const Disabled: Story = {
	render: () => (
		<Collapsible
			disabled
			defaultOpen={false}
			className="border-border w-80 overflow-hidden rounded-lg border opacity-60"
		>
			<CollapsibleTrigger className="bg-secondary flex w-full cursor-not-allowed items-center gap-2 px-4 py-2.5 text-left">
				<ChevronDown className="text-muted-foreground size-3.5 shrink-0" />
				<span className="text-foreground text-xs font-medium">
					Checkpoint outputs
				</span>
				<span className="text-2xs text-muted-foreground ml-auto">
					not available
				</span>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="bg-card text-muted-foreground px-4 py-3 text-xs">
					This content is unreachable while disabled.
				</div>
			</CollapsibleContent>
		</Collapsible>
	),
};

// ---------------------------------------------------------------------------
// LongContent — verifies scroll/overflow behaviour inside CollapsibleContent
// ---------------------------------------------------------------------------
export const LongContent: Story = {
	render: () => (
		<Collapsible
			defaultOpen
			className="border-border w-96 overflow-hidden rounded-lg border"
		>
			<CollapsibleTrigger className="bg-secondary data-[open]:border-border group/collapse flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left transition-all hover:brightness-[0.98] data-[open]:border-b">
				<ChevronDown className="text-muted-foreground size-3.5 shrink-0 -rotate-90 transition-transform group-data-[panel-open]/collapse:rotate-0" />
				<span className="text-foreground text-xs font-medium">Traceback</span>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div
					role="group"
					aria-label="Stack trace"
					tabIndex={0}
					className="bg-card text-muted-foreground max-h-48 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed"
				>
					{Array.from({ length: 18 }, (_, i) => (
						<p key={i} className="py-0.5">
							{String(i + 1).padStart(3, " ")} File
							&quot;pipeline/trainer.py&quot;, line {42 + i * 3}, in train_step
						</p>
					))}
				</div>
			</CollapsibleContent>
		</Collapsible>
	),
};

// ---------------------------------------------------------------------------
// Stacked — multiple collapsibles in a list; each independently toggled
// ---------------------------------------------------------------------------
export const Stacked: Story = {
	render: () => {
		const sections = [
			{
				id: "orchestrator",
				label: "Orchestrator",
				badge: "kubeflow",
				details: "namespace: zenml-prod · node_selector: ml-workload",
			},
			{
				id: "artifact_store",
				label: "Artifact Store",
				badge: "s3-zenfiles",
				details: "bucket: zenml-artifacts-eu · path_prefix: pipelines/",
			},
			{
				id: "experiment_tracker",
				label: "Experiment Tracker",
				badge: "mlflow",
				details:
					"tracking_uri: https://mlflow.zenml.io · experiment: production-traces",
			},
			{
				id: "container_registry",
				label: "Container Registry",
				badge: "aws-ecr-eu",
				details: "uri: 123456789.dkr.ecr.eu-central-1.amazonaws.com",
			},
		] as const;

		return (
			<div className="w-96 space-y-2">
				{sections.map((section) => (
					<Collapsible
						key={section.id}
						defaultOpen={section.id === "orchestrator"}
						className="border-border overflow-hidden rounded-lg border"
					>
						<CollapsibleTrigger className="bg-secondary data-[open]:border-border group/collapse flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left transition-all hover:brightness-[0.98] data-[open]:border-b">
							<ChevronDown className="text-muted-foreground size-3.5 shrink-0 -rotate-90 transition-transform group-data-[panel-open]/collapse:rotate-0" />
							<span className="text-foreground w-36 shrink-0 text-xs font-medium">
								{section.label}
							</span>
							<span className="text-muted-foreground truncate font-mono text-xs">
								{section.badge}
							</span>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<div className="bg-card text-muted-foreground px-4 py-3 font-mono text-xs leading-relaxed">
								{section.details}
							</div>
						</CollapsibleContent>
					</Collapsible>
				))}
			</div>
		);
	},
};

// ---------------------------------------------------------------------------
// Composed — realistic inline failure card pattern from the app
// ---------------------------------------------------------------------------
export const Composed: Story = {
	name: "Composed (Failure Card)",
	render: () => {
		const [copied, setCopied] = useState(false);

		const handleCopy = () => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		};

		return (
			<div className="w-[480px]">
				<Collapsible
					defaultOpen
					className="border-border bg-card overflow-hidden rounded-lg border"
				>
					<CollapsibleTrigger className="border-border hover:bg-accent/30 group/collapse flex h-10 w-full cursor-pointer items-center gap-2 border-b px-4 text-left transition-colors">
						<span className="bg-destructive size-2 shrink-0 rounded-full" />
						<span className="text-foreground shrink-0 font-mono text-xs font-semibold">
							train_classifier
						</span>
						<span className="text-muted-foreground flex-1 truncate text-xs">
							ValueError: Input shape mismatch — expected (None, 768), got
							(None, 512)
						</span>
						<span className="text-2xs text-destructive shrink-0 font-mono tabular-nums">
							failed
						</span>
						<ChevronDown className="text-muted-foreground size-3.5 shrink-0 -rotate-90 transition-transform group-data-[panel-open]/collapse:rotate-0" />
					</CollapsibleTrigger>

					<CollapsibleContent>
						<div className="flex flex-col gap-4 p-4">
							<div>
								<p className="text-2xs text-muted-foreground mb-2 font-semibold tracking-wider uppercase">
									Error
								</p>
								<div className="border-border bg-muted/30 rounded-md border p-3">
									<p className="text-destructive font-mono text-xs font-medium">
										ValueError
									</p>
									<p className="text-2xs text-muted-foreground mt-1 font-mono leading-relaxed">
										Input shape mismatch — expected (None, 768), got (None,
										512). Ensure the embedding model matches the downstream
										classifier input.
									</p>
								</div>
							</div>

							<div>
								<p className="text-2xs text-muted-foreground mb-2 font-semibold tracking-wider uppercase">
									Resume from this step
								</p>
								<div className="group border-border bg-muted/30 relative overflow-hidden rounded-md border">
									<div className="absolute top-2 right-2 z-10">
										<button
											type="button"
											onClick={handleCopy}
											aria-label={copied ? "Copied" : "Copy command"}
											className="border-border bg-card text-muted-foreground hover:text-foreground flex size-7 items-center justify-center rounded-md border opacity-0 transition-opacity group-hover:opacity-100"
										>
											{copied ? (
												<Check className="text-success size-3.5" />
											) : (
												<Copy className="size-3.5" />
											)}
										</button>
									</div>
									<pre
										role="group"
										aria-label="Command"
										tabIndex={0}
										className="text-foreground overflow-x-auto px-4 py-3 font-mono text-xs"
									>
										<code>
											zenml pipeline run training-pipeline --step
											train_classifier
										</code>
									</pre>
								</div>
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>
		);
	},
};
