import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";

import { Button } from "../button/button";
import { Toaster } from "./sonner";

/**
 * `Toaster` is the hashi-styled mount point for the Sonner toast library.
 * Mount it once at the application root; call `toast.*` from anywhere.
 *
 * A single `<Toaster />` is hoisted to the meta-level decorator so there is
 * exactly one instance per story frame. On the docs page each story renders
 * in its own iframe (iframeHeight: 260) which keeps Sonner's module-level
 * toast state isolated between stories.
 */
const meta: Meta<typeof Toaster> = {
	title: "Primitives/Toaster",
	component: Toaster,
	decorators: [
		(Story) => (
			<>
				<Toaster />
				<Story />
			</>
		),
	],
	parameters: {
		layout: "centered",
		docs: {
			story: {
				inline: false,
				iframeHeight: 260,
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof Toaster>;

// ---------------------------------------------------------------------------
// Default — playground driven by Storybook controls
// ---------------------------------------------------------------------------

export const Default: Story = {
	render: () => (
		<div className="flex flex-col items-center gap-3">
			<Button onClick={() => toast("Pipeline run started")}>Show toast</Button>
		</div>
	),
};

// ---------------------------------------------------------------------------
// Toast types — one button per variant so reviewers can trigger each icon
// ---------------------------------------------------------------------------

export const Types: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button variant="outline" onClick={() => toast("Pipeline run started")}>
				Default
			</Button>
			<Button variant="outline" onClick={() => toast.success("Secret created")}>
				Success
			</Button>
			<Button
				variant="outline"
				onClick={() =>
					toast.error("Could not delete secret.", {
						description: "You do not have permission to delete this secret.",
					})
				}
			>
				Error
			</Button>
			<Button
				variant="outline"
				onClick={() =>
					toast.warning("Step cache miss", {
						description:
							"zenml-eu-central is running without a warm cache for this step.",
					})
				}
			>
				Warning
			</Button>
			<Button
				variant="outline"
				onClick={() =>
					toast.info("New version available", {
						description: "ZenML 0.82.0 is ready to install.",
					})
				}
			>
				Info
			</Button>
			<Button
				variant="outline"
				onClick={() => {
					const id = toast.loading("Downloading artifact...");
					setTimeout(() => toast.dismiss(id), 3000);
				}}
			>
				Loading (auto-dismiss 3 s)
			</Button>
		</div>
	),
};

// ---------------------------------------------------------------------------
// With description — matches the real `toast.error("Download failed", { description })` pattern
// ---------------------------------------------------------------------------

export const WithDescription: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button
				onClick={() =>
					toast.success("Execution deleted", {
						description:
							"Production traces · run #3421 has been permanently removed.",
					})
				}
			>
				Success with description
			</Button>
			<Button
				variant="destructive"
				onClick={() =>
					toast.error("Download failed", {
						description:
							"Unable to reach zenml-eu-central. Check your network and retry.",
					})
				}
			>
				Error with description
			</Button>
		</div>
	),
};

// ---------------------------------------------------------------------------
// With action — toast carries an inline action button
// ---------------------------------------------------------------------------

export const WithAction: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button
				onClick={() =>
					toast("API key rotated", {
						description: "Old key will expire in 24 hours.",
						action: {
							label: "View key",
							onClick: () => undefined,
						},
					})
				}
			>
				With action
			</Button>
			<Button
				variant="outline"
				onClick={() =>
					toast.error("Invocation failed", {
						description:
							"The pipeline encountered an error on step feature_engineering.",
						action: {
							label: "View logs",
							onClick: () => undefined,
						},
					})
				}
			>
				Error with action
			</Button>
		</div>
	),
};

// ---------------------------------------------------------------------------
// Position — demonstrates the `position` prop consumers can pass to Toaster.
// This story provides its own Toaster so the position prop takes effect;
// the meta decorator's Toaster is still present but receives no toasts from
// the per-position toast() calls because each call carries an explicit
// `position` that matches the story-local Toaster.
// ---------------------------------------------------------------------------

export const Positions: Story = {
	parameters: {
		a11y: {
			config: {
				// Two Toaster instances (one from meta decorator, one story-local)
				// both render <section aria-label="Notifications alt+T"> — Sonner
				// internals, not fixable from story markup without removing the
				// second Toaster which would break the position demo.
				rules: [{ id: "landmark-unique", enabled: false }],
			},
		},
	},
	decorators: [
		(Story) => (
			<>
				<Toaster position="top-center" />
				<Story />
			</>
		),
	],
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button
				variant="outline"
				onClick={() =>
					toast.success("Secret updated", { position: "top-center" })
				}
			>
				Top center
			</Button>
			<Button
				variant="outline"
				onClick={() =>
					toast.success("Secret updated", { position: "bottom-right" })
				}
			>
				Bottom right (default)
			</Button>
			<Button
				variant="outline"
				onClick={() =>
					toast.success("Secret updated", { position: "bottom-left" })
				}
			>
				Bottom left
			</Button>
		</div>
	),
};

// ---------------------------------------------------------------------------
// Composed — realistic multi-step flow mimicking a secret deletion
// ---------------------------------------------------------------------------

export const Composed: Story = {
	name: "Composed — delete secret flow",
	render: () => (
		<div className="flex flex-col items-start gap-4">
			<p className="text-muted-foreground text-sm">
				Simulate the optimistic delete + error recovery pattern used across the
				app.
			</p>
			<div className="flex gap-3">
				<Button
					onClick={() =>
						toast.success("Secret deleted", {
							description:
								'"stripe-prod-webhook" has been permanently removed.',
						})
					}
				>
					Delete succeeds
				</Button>
				<Button
					variant="destructive"
					onClick={() =>
						toast.error("Could not delete secret.", {
							description:
								'"stripe-prod-webhook" is referenced by 2 active pipelines.',
							action: {
								label: "View usages",
								onClick: () => undefined,
							},
						})
					}
				>
					Delete fails
				</Button>
			</div>
		</div>
	),
};
