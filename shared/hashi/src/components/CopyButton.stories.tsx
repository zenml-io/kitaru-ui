import type { Meta, StoryObj } from "@storybook/react-vite";

import { CopyButton } from "./CopyButton";

/**
 * `CopyButton` copies `text` to the clipboard on click. It owns its own
 * copied state and surfaces tooltip feedback ("Copy to clipboard" → "Copied!")
 * via the underlying `IconButton`, so consumers only pass the text.
 *
 * The tooltip portal needs a `TooltipProvider`; the global preview decorator
 * supplies it, matching how the app mounts one at its root.
 */
const meta: Meta<typeof CopyButton> = {
	title: "Components/CopyButton",
	component: CopyButton,
	args: {
		text: "9f8c1a2b-4d3e-4f5a-8b6c-7d8e9f0a1b2c",
		label: "Copy to clipboard",
		copiedLabel: "Copied!",
		variant: "ghost",
		size: "icon-sm",
		tooltipSide: "bottom",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "destructive", "outline", "secondary", "ghost"],
		},
		size: {
			control: "select",
			options: ["icon-xs", "icon-sm", "icon", "icon-lg"],
		},
		tooltipSide: {
			control: "select",
			options: ["top", "bottom", "left", "right"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

// ─── Default (controls-driven) ───────────────────────────────────────────────

export const Default: Story = {};

// ─── Variants ────────────────────────────────────────────────────────────────

/**
 * Ghost is the default (blends into toolbars and inline rows); outline for
 * standalone secondary actions.
 */
export const Variants: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<CopyButton text="ghost variant" variant="ghost" />
			<CopyButton text="outline variant" variant="outline" />
		</div>
	),
};

// ─── Composed: copyable id (hover to reveal) ─────────────────────────────────

/**
 * The execution-detail call site: a monospace id with the copy button hidden
 * until the row is hovered (or focused). Copies the full id even though a
 * shortened form may be displayed.
 */
export const CopyableId: Story = {
	name: "Composed — Copyable ID (hover to reveal)",
	render: () => (
		<div className="group/execid flex items-center gap-1.5">
			<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
				ID
			</span>
			<span className="text-foreground font-mono text-sm">
				9f8c1a2b-4d3e-4f5a-8b6c-7d8e9f0a1b2c
			</span>
			<CopyButton
				text="9f8c1a2b-4d3e-4f5a-8b6c-7d8e9f0a1b2c"
				className="invisible opacity-0 transition-opacity group-focus-within/execid:visible group-focus-within/execid:opacity-100 group-hover/execid:visible group-hover/execid:opacity-100"
			/>
		</div>
	),
};
