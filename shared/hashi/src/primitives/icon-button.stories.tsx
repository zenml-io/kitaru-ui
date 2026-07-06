import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Bell,
	Copy,
	Download,
	Ellipsis,
	Maximize2,
	PanelLeft,
	Plus,
	Search,
	Settings,
	Trash2,
	X,
} from "lucide-react";

import { IconButton } from "./icon-button";

/**
 * `IconButton` is a Tooltip + Button composition for icon-only actions.
 * The `label` prop doubles as the accessible `aria-label` and the tooltip text,
 * so consumers never need to wire them separately.
 *
 * The tooltip portal needs a `TooltipProvider` for context; the global preview
 * decorator supplies it, matching how the app mounts one at its root.
 */
const meta: Meta<typeof IconButton> = {
	title: "Primitives/IconButton",
	component: IconButton,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=65-26",
		},
	},
	args: {
		label: "Settings",
		icon: <Settings />,
		variant: "ghost",
		size: "icon-sm",
		tooltipSide: "bottom",
		disabled: false,
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
type Story = StoryObj<typeof IconButton>;

// ─── Default (controls-driven) ───────────────────────────────────────────────

export const Default: Story = {};

// ─── Variants ────────────────────────────────────────────────────────────────

/**
 * Three most common variants. Ghost is the default for toolbar actions;
 * outline for secondary standalone actions; default for primary CTAs.
 */
export const Variants: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<IconButton icon={<Settings />} label="Settings" variant="ghost" />
			<IconButton icon={<Copy />} label="Copy" variant="outline" />
			<IconButton icon={<Plus />} label="New pipeline" variant="default" />
		</div>
	),
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

/**
 * Four icon sizes in ascending order. `icon-xs` fits compact toolbars;
 * `icon-sm` is the standard; `icon` for medium-emphasis; `icon-lg` for
 * touch-first surfaces.
 */
export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<div className="flex flex-col items-center gap-1.5">
				<IconButton icon={<Search />} label="Search" size="icon-xs" />
				<span className="text-2xs text-muted-foreground">icon-xs</span>
			</div>
			<div className="flex flex-col items-center gap-1.5">
				<IconButton icon={<Copy />} label="Copy" size="icon-sm" />
				<span className="text-2xs text-muted-foreground">icon-sm</span>
			</div>
			<div className="flex flex-col items-center gap-1.5">
				<IconButton icon={<Settings />} label="Settings" size="icon" />
				<span className="text-2xs text-muted-foreground">icon</span>
			</div>
			<div className="flex flex-col items-center gap-1.5">
				<IconButton icon={<Bell />} label="Notifications" size="icon-lg" />
				<span className="text-2xs text-muted-foreground">icon-lg</span>
			</div>
		</div>
	),
};

// ─── Tooltip sides ────────────────────────────────────────────────────────────

/**
 * `tooltipSide` controls where the tooltip appears relative to the trigger.
 * Use `bottom` for toolbar buttons (default), `top` for bottom-anchored items.
 */
export const TooltipSides: Story = {
	render: () => (
		<div className="flex items-center justify-center gap-8 p-8">
			<IconButton
				icon={<Settings />}
				label="Tooltip on top"
				tooltipSide="top"
			/>
			<IconButton
				icon={<Settings />}
				label="Tooltip on bottom"
				tooltipSide="bottom"
			/>
			<IconButton
				icon={<Settings />}
				label="Tooltip on left"
				tooltipSide="left"
			/>
			<IconButton
				icon={<Settings />}
				label="Tooltip on right"
				tooltipSide="right"
			/>
		</div>
	),
};

// ─── States ───────────────────────────────────────────────────────────────────

/**
 * Disabled suppresses both interaction and the tooltip. Use for actions that
 * are not currently available — pair with a separate explanation if the reason
 * is not obvious.
 */
export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

// ─── Destructive ─────────────────────────────────────────────────────────────

/**
 * Destructive intent is expressed via className, not `variant="destructive"`,
 * so the button remains ghost/outline (low visual weight) until the action is
 * confirmed. This matches the pattern used in detail panels and table rows.
 */
export const Destructive: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<IconButton
				icon={<Trash2 />}
				label="Delete run"
				variant="ghost"
				className="text-destructive hover:text-destructive"
			/>
			<IconButton
				icon={<Trash2 />}
				label="Delete artifact"
				variant="outline"
				className="text-destructive hover:text-destructive"
			/>
		</div>
	),
};

// ─── Dismiss / close ─────────────────────────────────────────────────────────

/**
 * `X` / close patterns appear in banners, sheets, and notification toasts.
 * Always ghost so the button recedes into the surface.
 */
export const Dismiss: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<IconButton icon={<X />} label="Close panel" size="icon-xs" />
			<IconButton icon={<X />} label="Dismiss alert" size="icon-sm" />
		</div>
	),
};

// ─── Composed: panel toolbar ──────────────────────────────────────────────────

/**
 * A realistic toolbar strip from the execution-logs panel. Each `IconButton`
 * carries a distinct tooltip so assistive tech can distinguish actions without
 * visible labels.
 */
export const PanelToolbar: Story = {
	render: () => (
		<div className="border-border flex w-fit items-center gap-1.5 rounded-lg border px-3 py-2">
			<IconButton
				icon={<PanelLeft className="size-4" />}
				label="Toggle sidebar"
				size="icon-sm"
			/>
			<div className="bg-border h-4 w-px" />
			<IconButton
				icon={<Copy className="size-4" />}
				label="Copy logs"
				variant="outline"
				size="icon-sm"
			/>
			<IconButton
				icon={<Download className="size-4" />}
				label="Download logs"
				variant="outline"
				size="icon-sm"
			/>
			<div className="bg-border h-4 w-px" />
			<IconButton
				icon={<Maximize2 className="size-4" />}
				label="Open full logs view"
				variant="outline"
				size="icon-sm"
			/>
		</div>
	),
};

// ─── Composed: overflow trigger ───────────────────────────────────────────────

/**
 * `Ellipsis` (`MoreHorizontal`) is the canonical overflow/row-actions trigger.
 * Always ghost, never outline — the button blends until hovered.
 */
export const OverflowTrigger: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<div className="border-border flex w-64 items-center justify-between rounded-lg border px-4 py-2.5">
				<span className="text-foreground text-sm">zenml-eu-central</span>
				<IconButton
					icon={<Ellipsis className="size-4" />}
					label="More actions"
					variant="ghost"
					size="icon"
				/>
			</div>
			<div className="border-border flex w-64 items-center justify-between rounded-lg border px-4 py-2.5">
				<span className="text-foreground text-sm">production-traces</span>
				<IconButton
					icon={<Ellipsis className="size-4" />}
					label="More actions"
					variant="ghost"
					size="icon"
				/>
			</div>
		</div>
	),
};
