import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Bell,
	Copy,
	GitBranch,
	Info,
	MoreHorizontal,
	Settings,
	Trash2,
	Zap,
} from "lucide-react";

import { Button } from "./button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";

/**
 * Tooltip surfaces contextual labels for icon-only buttons, truncated text,
 * and supplemental metadata. Requires a TooltipProvider in the component tree;
 * the global preview decorator supplies it. The `DelayVariants` story mounts its
 * own nested `TooltipProvider`s to demonstrate the per-scope `delay` prop.
 *
 * The four sub-components map to Base UI's headless primitive:
 * TooltipProvider → Tooltip → TooltipTrigger → TooltipContent.
 */
const meta: Meta<typeof Tooltip> = {
	title: "Primitives/Tooltip",
	component: Tooltip,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=79-5",
		},
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// ---------------------------------------------------------------------------
// Default — minimal args-driven story
// ---------------------------------------------------------------------------

export const Default: Story = {
	render: () => (
		<Tooltip>
			<TooltipTrigger
				render={<Button variant="outline" size="icon" aria-label="Settings" />}
			>
				<Settings />
			</TooltipTrigger>
			<TooltipContent>Settings</TooltipContent>
		</Tooltip>
	),
};

// ---------------------------------------------------------------------------
// Placement — all four sides
// ---------------------------------------------------------------------------

export const Placement: Story = {
	render: () => (
		<div className="grid grid-cols-2 gap-6 p-8">
			{(
				[
					{ side: "top", label: "top" },
					{ side: "right", label: "right" },
					{ side: "bottom", label: "bottom" },
					{ side: "left", label: "left" },
				] as const
			).map(({ side, label }) => (
				<Tooltip key={side}>
					<TooltipTrigger
						render={
							<Button
								variant="outline"
								size="sm"
								aria-label={`Tooltip on ${label}`}
							/>
						}
					>
						{label}
					</TooltipTrigger>
					<TooltipContent side={side}>Appears on {label}</TooltipContent>
				</Tooltip>
			))}
		</div>
	),
};

// ---------------------------------------------------------------------------
// WithIcon — icon-only button triggers (most common real use case)
// ---------------------------------------------------------------------------

export const WithIcon: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Tooltip>
				<TooltipTrigger
					render={
						<Button variant="ghost" size="icon-sm" aria-label="Copy run ID" />
					}
				>
					<Copy />
				</TooltipTrigger>
				<TooltipContent side="bottom">Copy run ID</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Branch details"
						/>
					}
				>
					<GitBranch />
				</TooltipTrigger>
				<TooltipContent side="bottom">View branch</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger
					render={
						<Button variant="ghost" size="icon-sm" aria-label="More actions" />
					}
				>
					<MoreHorizontal />
				</TooltipTrigger>
				<TooltipContent side="bottom">More actions</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Delete pipeline"
						/>
					}
				>
					<Trash2 />
				</TooltipTrigger>
				<TooltipContent side="bottom">Delete pipeline</TooltipContent>
			</Tooltip>
		</div>
	),
};

// ---------------------------------------------------------------------------
// RichContent — multi-line tooltip with structured metadata
// ---------------------------------------------------------------------------

export const RichContent: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							variant="outline"
							size="icon-sm"
							aria-label="Billing information"
						/>
					}
				>
					<Info />
				</TooltipTrigger>
				<TooltipContent side="bottom" className="max-w-56">
					<span>Billing · $24.91 this month</span>
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							variant="outline"
							size="sm"
							aria-label="Trigger pipeline run"
						/>
					}
				>
					<Zap />
					Trigger run
				</TooltipTrigger>
				<TooltipContent side="top" className="max-w-64">
					Manually trigger a new pipeline run against the current stack
					configuration.
				</TooltipContent>
			</Tooltip>
		</div>
	),
};

// ---------------------------------------------------------------------------
// DelayVariants — custom per-tooltip open delays via TooltipProvider
// ---------------------------------------------------------------------------

export const DelayVariants: Story = {
	render: () => (
		<div className="flex items-center gap-6">
			<div className="flex flex-col items-center gap-2">
				<span className="text-muted-foreground text-xs">delay 0 ms</span>
				<TooltipProvider delay={0}>
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									variant="outline"
									size="icon"
									aria-label="Notifications (instant)"
								/>
							}
						>
							<Bell />
						</TooltipTrigger>
						<TooltipContent>Notifications</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<div className="flex flex-col items-center gap-2">
				<span className="text-muted-foreground text-xs">delay 400 ms</span>
				<TooltipProvider delay={400}>
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									variant="outline"
									size="icon"
									aria-label="Settings (delayed)"
								/>
							}
						>
							<Settings />
						</TooltipTrigger>
						<TooltipContent>Settings</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<div className="flex flex-col items-center gap-2">
				<span className="text-muted-foreground text-xs">delay 800 ms</span>
				<TooltipProvider delay={800}>
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									variant="outline"
									size="icon"
									aria-label="Quick action (slow)"
								/>
							}
						>
							<Zap />
						</TooltipTrigger>
						<TooltipContent>Quick action</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	),
};

// ---------------------------------------------------------------------------
// TruncatedText — tooltip surfacing full text for a clipped label
// ---------------------------------------------------------------------------

export const TruncatedText: Story = {
	render: () => (
		<div className="w-64 space-y-2">
			<p className="text-muted-foreground text-xs">
				Hover the pipeline name to see the full value.
			</p>
			<Tooltip>
				<TooltipTrigger
					render={
						<p className="text-foreground cursor-default truncate text-sm font-medium" />
					}
				>
					training-pipeline-v3-eu-central-nightly-2026-06-11
				</TooltipTrigger>
				<TooltipContent side="bottom">
					training-pipeline-v3-eu-central-nightly-2026-06-11
				</TooltipContent>
			</Tooltip>
		</div>
	),
};

// ---------------------------------------------------------------------------
// Composed — realistic toolbar with mixed button sizes and placements
// ---------------------------------------------------------------------------

export const Composed: Story = {
	render: () => (
		<div className="bg-card rounded-lg border p-4">
			<div className="mb-3 flex items-center justify-between">
				<span className="text-foreground text-sm font-medium">
					production-traces · zenml-eu-central
				</span>
				<div className="flex items-center gap-1">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label="Copy pipeline ID"
								/>
							}
						>
							<Copy />
						</TooltipTrigger>
						<TooltipContent side="bottom">Copy pipeline ID</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label="Trigger new run"
								/>
							}
						>
							<Zap />
						</TooltipTrigger>
						<TooltipContent side="bottom">Trigger new run</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label="Delete pipeline"
								/>
							}
						>
							<Trash2 />
						</TooltipTrigger>
						<TooltipContent side="bottom">Delete pipeline</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label="More actions"
								/>
							}
						>
							<MoreHorizontal />
						</TooltipTrigger>
						<TooltipContent side="bottom">More actions</TooltipContent>
					</Tooltip>
				</div>
			</div>
			<p className="text-muted-foreground text-xs">
				Last run 3 minutes ago · 14 steps completed
			</p>
		</div>
	),
};
