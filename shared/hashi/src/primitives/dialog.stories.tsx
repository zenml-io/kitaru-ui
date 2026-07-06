import type { Meta, StoryObj } from "@storybook/react-vite";
import { RefreshCcw, Trash2 } from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

const meta: Meta<typeof DialogContent> = {
	title: "Primitives/Dialog",
	component: DialogContent,
	args: {
		showCloseButton: true,
	},
	argTypes: {
		showCloseButton: {
			control: "boolean",
		},
	},
};

export default meta;
type Story = StoryObj<typeof DialogContent>;

// Default: trigger-based story driven by args
export const Default: Story = {
	render: (args) => (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>
				Open dialog
			</DialogTrigger>
			<DialogContent {...args}>
				<DialogHeader>
					<DialogTitle>Dialog title</DialogTitle>
					<DialogDescription>Dialog description goes here.</DialogDescription>
				</DialogHeader>
				<p className="text-sm">Dialog body content.</p>
			</DialogContent>
		</Dialog>
	),
};

// Always-open story for visual snapshots — renders in its own iframe on the docs page
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
		<Dialog defaultOpen>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete deployment</DialogTitle>
					<DialogDescription>
						This stops serving traffic for cluster-prod-us-east. The action
						cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>
						Cancel
					</DialogClose>
					<Button variant="destructive">Delete deployment</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

// With a footer containing action buttons
export const WithFooter: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>
				Re-run pipeline
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Re-run pipeline</DialogTitle>
					<DialogDescription>
						Re-runs feature_pipeline with the current configuration on
						zenml-eu-central.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>
						Cancel
					</DialogClose>
					<Button>
						<RefreshCcw className="size-4" />
						Re-run
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

// DialogFooter's built-in close button (showCloseButton renders a Close action)
export const FooterCloseButton: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>
				Pipeline submitted
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Pipeline submitted</DialogTitle>
					<DialogDescription>
						feature_pipeline · run #418 was queued on zenml-eu-central.
					</DialogDescription>
				</DialogHeader>
				<p className="text-muted-foreground text-sm">
					You can track progress from the runs list once it starts executing.
				</p>
				<DialogFooter showCloseButton />
			</DialogContent>
		</Dialog>
	),
};

// Without the built-in corner close button (consumer manages close themselves)
export const NoCloseButton: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>
				Production traces
			</DialogTrigger>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>Production traces</DialogTitle>
					<DialogDescription>
						Live execution trace for pipeline run #289.
					</DialogDescription>
				</DialogHeader>
				<p className="text-muted-foreground text-sm">
					The corner close button is suppressed; the consumer supplies its own
					dismiss control.
				</p>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>
						Dismiss
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

// Trigger variants: different trigger styles a consumer might use
export const TriggerVariants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Dialog>
				<DialogTrigger render={<Button />}>Open</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Default trigger</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<Dialog>
				<DialogTrigger render={<Button variant="outline" />}>
					Edit tags
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Outline trigger</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<Dialog>
				<DialogTrigger render={<Button variant="destructive" />}>
					<Trash2 className="size-4" />
					Delete
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Destructive trigger</DialogTitle>
						<DialogDescription>
							Opened from a destructive button with a leading icon.
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	),
};

// Realistic: a form dialog mirroring the "Register New Secret" surface
export const RegisterSecret: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger render={<Button />}>Register secret</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Register new secret</DialogTitle>
					<DialogDescription>
						Secrets are encrypted at rest and resolved at runtime from your
						pipeline steps.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="secret-name">
							Secret name <span className="text-destructive">*</span>
						</Label>
						<Input id="secret-name" placeholder="aws-prod-credentials" />
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="secret-key">Key</Label>
						<Input id="secret-key" placeholder="AWS_ACCESS_KEY_ID" />
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="secret-value">Value</Label>
						<Input
							id="secret-value"
							type="password"
							placeholder="••••••••••••••••"
						/>
					</div>
				</div>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>
						Cancel
					</DialogClose>
					<Button>Register secret</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

// Long content: verifies the dialog body scrolls and stays within the viewport
export const LongContent: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>
				Execution log
			</DialogTrigger>
			<DialogContent className="max-h-[80vh] sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Execution log — run #289</DialogTitle>
					<DialogDescription>
						Full step log for the data_processing pipeline. Scroll to see all
						entries.
					</DialogDescription>
				</DialogHeader>
				<div className="min-h-0 overflow-y-auto">
					<div className="space-y-2">
						{Array.from({ length: 24 }, (_, i) => (
							<div
								key={i}
								className="flex items-center justify-between rounded-md border px-3 py-2"
							>
								<span className="font-mono text-sm font-medium">
									step_{String(i + 1).padStart(2, "0")}
								</span>
								<span className="text-muted-foreground font-mono text-xs tabular-nums">
									{((i % 5) * 0.6 + 0.3).toFixed(1)}s
								</span>
							</div>
						))}
					</div>
				</div>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>Close</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

// Edge case: a long title and description that must wrap cleanly
export const LongTitle: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>
				Move exclusive tag
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Move exclusive tag “production” from content_pipeline · eu-west-1 to
						cluster-prod-us-east
					</DialogTitle>
					<DialogDescription>
						Exclusive tags can only live on one deployment at a time. Confirming
						this will detach the tag from its current deployment and route
						traffic to the new target.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>
						Cancel
					</DialogClose>
					<Button>Move tag</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};
