import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck, Settings, SlidersHorizontal } from "lucide-react";

import { Button } from "./button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./sheet";

const meta: Meta<typeof SheetContent> = {
	title: "Primitives/Sheet",
	component: SheetContent,
	args: {
		side: "right",
		showCloseButton: true,
	},
	argTypes: {
		side: {
			control: "select",
			options: ["top", "right", "bottom", "left"],
		},
		showCloseButton: {
			control: "boolean",
		},
	},
};

export default meta;
type Story = StoryObj<typeof SheetContent>;

// Default: trigger-based story driven by args
export const Default: Story = {
	render: (args) => (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" />}>
				Open Sheet
			</SheetTrigger>
			<SheetContent {...args}>
				<SheetHeader>
					<SheetTitle>Sheet title</SheetTitle>
					<SheetDescription>Sheet description goes here.</SheetDescription>
				</SheetHeader>
				<div className="px-4">
					<p className="text-sm">Sheet body content.</p>
				</div>
			</SheetContent>
		</Sheet>
	),
};

// All four side positions
export const Sides: Story = {
	render: () => (
		<div className="flex flex-wrap gap-3">
			{(["right", "left", "bottom", "top"] as const).map((side) => (
				<Sheet key={side}>
					<SheetTrigger render={<Button variant="outline" />}>
						Open {side}
					</SheetTrigger>
					<SheetContent side={side}>
						<SheetHeader>
							<SheetTitle>
								{side.charAt(0).toUpperCase() + side.slice(1)} sheet
							</SheetTitle>
							<SheetDescription>
								Slides in from the {side} edge of the viewport.
							</SheetDescription>
						</SheetHeader>
					</SheetContent>
				</Sheet>
			))}
		</div>
	),
};

// Single always-open story for visual snapshot — rendered in an iframe to avoid stacked backdrops
export const Open: Story = {
	parameters: {
		docs: {
			story: {
				inline: false,
				iframeHeight: 480,
			},
		},
	},
	render: () => (
		<Sheet defaultOpen>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Run #142 — research_agent</SheetTitle>
					<SheetDescription>
						Completed in 3.2s · $0.0234 · 2,481 tokens
					</SheetDescription>
				</SheetHeader>
				<div className="space-y-4 px-4">
					<div>
						<p className="text-section-label mb-2">Steps</p>
						<div className="space-y-2">
							{(
								[
									["Plan Research", "0.8s"],
									["Search Web", "1.6s"],
									["Synthesize", "0.8s"],
								] as const
							).map(([step, duration]) => (
								<div
									key={step}
									className="flex items-center justify-between rounded-md border px-3 py-2"
								>
									<div className="flex items-center gap-2">
										<CircleCheck className="text-primary size-4" />
										<span className="text-sm font-medium">{step}</span>
									</div>
									<span className="text-muted-foreground font-mono text-xs font-medium tabular-nums">
										{duration}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	),
};

// With a footer containing action buttons
export const WithFooter: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" />}>
				Open configuration
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Run configuration</SheetTitle>
					<SheetDescription>
						Adjust parameters before re-running the pipeline.
					</SheetDescription>
				</SheetHeader>
				<div className="flex flex-col gap-3 px-4">
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium">Max retries</span>
						<span className="text-muted-foreground text-sm">3</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium">Timeout</span>
						<span className="text-muted-foreground text-sm">120s</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium">Stack</span>
						<span className="text-muted-foreground text-sm">
							zenml-eu-central
						</span>
					</div>
				</div>
				<SheetFooter>
					<SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
					<Button>Apply and re-run</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	),
};

// Without the built-in close button (consumer manages close themselves)
export const NoCloseButton: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" />}>
				Open traces
			</SheetTrigger>
			<SheetContent showCloseButton={false}>
				<SheetHeader>
					<SheetTitle>Production traces</SheetTitle>
					<SheetDescription>
						Live execution trace for pipeline run #289.
					</SheetDescription>
				</SheetHeader>
				<div className="px-4">
					<p className="text-muted-foreground text-sm">
						Close button is suppressed; the consumer supplies its own dismiss
						control.
					</p>
				</div>
				<SheetFooter>
					<SheetClose render={<Button variant="outline" />}>Dismiss</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	),
};

// Trigger variants: different trigger styles a consumer might use
export const TriggerVariants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Sheet>
				<SheetTrigger render={<Button />}>Open panel</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Default trigger</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>
			<Sheet>
				<SheetTrigger render={<Button variant="outline" />}>
					Settings
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Outline trigger</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>
			<Sheet>
				<SheetTrigger
					render={
						<Button variant="ghost" size="icon" aria-label="Open filters" />
					}
				>
					<SlidersHorizontal className="size-4" />
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Icon trigger</SheetTitle>
						<SheetDescription>
							Opened from an icon-only ghost button.
						</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</div>
	),
};

// Realistic: detail panel for a pipeline run — mirrors production usage
export const PipelineRunDetail: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" />}>
				View run details
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>feature_pipeline · run #418</SheetTitle>
					<SheetDescription>
						Started 14 min ago · zenml-eu-central · claude-sonnet-4-5
					</SheetDescription>
				</SheetHeader>
				<div className="space-y-4 px-4">
					<div>
						<h4 className="text-section-label mb-2">Steps</h4>
						<div className="space-y-2">
							{(
								[
									["ingest_raw_data", "2.1s", true],
									["validate_schema", "0.4s", true],
									["transform_features", "4.8s", true],
									["upload_to_store", "1.2s", false],
								] as const
							).map(([name, dur, done]) => (
								<div
									key={name}
									className="flex items-center justify-between rounded-md border px-3 py-2"
								>
									<div className="flex items-center gap-2">
										<CircleCheck
											className={`size-4 ${done ? "text-primary" : "text-muted-foreground"}`}
										/>
										<span className="text-sm font-medium">{name}</span>
									</div>
									<span className="text-muted-foreground font-mono text-xs font-medium tabular-nums">
										{done ? dur : "—"}
									</span>
								</div>
							))}
						</div>
					</div>
					<div>
						<h4 className="text-section-label mb-2">Metadata</h4>
						<div className="grid grid-cols-2 gap-y-2">
							<span className="text-muted-foreground text-sm">Stack</span>
							<span className="text-sm font-medium">zenml-eu-central</span>
							<span className="text-muted-foreground text-sm">Cost</span>
							<span className="text-sm font-medium tabular-nums">$0.0087</span>
							<span className="text-muted-foreground text-sm">Tokens</span>
							<span className="text-sm font-medium tabular-nums">1,204</span>
						</div>
					</div>
				</div>
				<SheetFooter>
					<SheetClose render={<Button variant="outline" />}>Close</SheetClose>
					<Button>
						<Settings className="size-4" />
						Re-run
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	),
};

// Long content: verifies that the sheet body scrolls and the header/footer stay fixed
export const LongContent: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" />}>
				View full log
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Execution log — run #289</SheetTitle>
					<SheetDescription>
						Full step log for the data_processing pipeline. Scroll to see all
						entries.
					</SheetDescription>
				</SheetHeader>
				<div className="overflow-y-auto px-4">
					<div className="space-y-2">
						{Array.from({ length: 24 }, (_, i) => (
							<div
								key={i}
								className="flex items-center justify-between rounded-md border px-3 py-2"
							>
								<div className="flex items-center gap-2">
									<CircleCheck className="text-primary size-4" />
									<span className="text-sm font-medium">
										step_{String(i + 1).padStart(2, "0")}
									</span>
								</div>
								<span className="text-muted-foreground font-mono text-xs tabular-nums">
									{(((i * 7) % 27) / 10 + 0.3).toFixed(1)}s
								</span>
							</div>
						))}
					</div>
				</div>
				<SheetFooter>
					<SheetClose render={<Button variant="outline" />}>Close</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	),
};
