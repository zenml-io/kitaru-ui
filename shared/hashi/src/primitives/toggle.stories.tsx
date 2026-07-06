import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	AlignLeft,
	AlignCenter,
	AlignRight,
	Grid2x2,
	List,
	Bold,
	Italic,
	Underline,
	Eye,
	EyeOff,
} from "lucide-react";

import { Toggle } from "./toggle";

const meta: Meta<typeof Toggle> = {
	title: "Primitives/Toggle",
	component: Toggle,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=71-20",
		},
	},
	args: {
		children: "Toggle",
		variant: "default",
		size: "default",
		disabled: false,
		defaultPressed: false,
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "outline", "pill"],
		},
		size: {
			control: "select",
			options: ["sm", "default", "lg"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Toggle variant="default">Default</Toggle>
			<Toggle variant="outline">Outline</Toggle>
			<Toggle variant="pill">Pill</Toggle>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-3">
			<Toggle size="sm">Small</Toggle>
			<Toggle size="default">Default</Toggle>
			<Toggle size="lg">Large</Toggle>
		</div>
	),
};

/**
 * Pressed state for all three variants. The `pill` variant uses a filled
 * primary background when pressed — the most visually distinct treatment.
 */
export const PressedVariants: Story = {
	name: "Pressed (per variant)",
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Toggle variant="default" defaultPressed>
				Default pressed
			</Toggle>
			<Toggle variant="outline" defaultPressed>
				Outline pressed
			</Toggle>
			<Toggle variant="pill" defaultPressed>
				Pill pressed
			</Toggle>
		</div>
	),
};

export const States: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<Toggle variant="outline" aria-label="Idle">
					Idle
				</Toggle>
				<span className="text-muted-foreground text-xs">Default (idle)</span>
			</div>
			<div className="flex items-center gap-3">
				<Toggle variant="outline" defaultPressed aria-label="Pressed">
					Pressed
				</Toggle>
				<span className="text-muted-foreground text-xs">Pressed</span>
			</div>
			<div className="flex items-center gap-3">
				<Toggle variant="outline" disabled aria-label="Disabled">
					Disabled
				</Toggle>
				<span className="text-muted-foreground text-xs">Disabled (idle)</span>
			</div>
			<div className="flex items-center gap-3">
				<Toggle
					variant="outline"
					disabled
					defaultPressed
					aria-label="Disabled pressed"
				>
					Disabled pressed
				</Toggle>
				<span className="text-muted-foreground text-xs">
					Disabled + pressed
				</span>
			</div>
		</div>
	),
};

/**
 * Icon-only toggles must always carry an `aria-label`.
 * Used in toolbars where horizontal space is limited.
 */
export const IconOnly: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Toggle variant="outline" aria-label="Grid view">
				<Grid2x2 />
			</Toggle>
			<Toggle variant="outline" defaultPressed aria-label="List view">
				<List />
			</Toggle>
			<Toggle variant="outline" size="sm" aria-label="Bold">
				<Bold />
			</Toggle>
			<Toggle variant="outline" size="sm" defaultPressed aria-label="Italic">
				<Italic />
			</Toggle>
			<Toggle variant="outline" size="sm" aria-label="Underline">
				<Underline />
			</Toggle>
		</div>
	),
};

/**
 * Icon + label — the most common toolbar shape.
 * Communicates both the action and its current state without relying on
 * icon recognition alone.
 */
export const WithIcon: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Toggle variant="outline">
				<Grid2x2 />
				Grid
			</Toggle>
			<Toggle variant="outline" defaultPressed>
				<List />
				List
			</Toggle>
			<Toggle variant="pill">
				<Eye />
				Show filters
			</Toggle>
			<Toggle variant="pill" defaultPressed>
				<EyeOff />
				Filters hidden
			</Toggle>
		</div>
	),
};

/**
 * Text-only pill toggles — filter chip pattern used in data tables.
 * Each pill carries a single filter category.
 */
export const PillFilters: Story = {
	name: "Pill (filter chips)",
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Toggle variant="pill" size="sm" defaultPressed>
				All
			</Toggle>
			<Toggle variant="pill" size="sm">
				Running
			</Toggle>
			<Toggle variant="pill" size="sm">
				Completed
			</Toggle>
			<Toggle variant="pill" size="sm">
				Failed
			</Toggle>
			<Toggle variant="pill" size="sm">
				Cached
			</Toggle>
		</div>
	),
};

/**
 * Controlled toggle — demonstrates binding `pressed` + `onPressedChange`.
 * Mirrors the execution-detail toolbar pattern where visibility state is
 * tracked in the parent.
 */
export const Controlled: Story = {
	render: function Render() {
		const [pressed, setPressed] = React.useState(false);
		return (
			<div className="flex flex-col items-start gap-3">
				<Toggle
					variant="outline"
					pressed={pressed}
					onPressedChange={(v) => setPressed(Boolean(v))}
					aria-label="Toggle sidebar"
				>
					{pressed ? <EyeOff /> : <Eye />}
					{pressed ? "Sidebar hidden" : "Sidebar visible"}
				</Toggle>
				<span className="text-muted-foreground text-xs">
					State:{" "}
					<span className="font-mono font-semibold">
						{pressed ? "pressed" : "idle"}
					</span>
				</span>
			</div>
		);
	},
};

/**
 * Realistic toolbar composed of independent toggles and an icon-only toggle.
 * Demonstrates how standalone `Toggle` fits in a production toolbar
 * alongside other controls — as seen in the execution-detail and
 * production-traces pages.
 */
export const ToolbarComposed: Story = {
	name: "Composed — trace viewer toolbar",
	render: function Render() {
		const [showTimeline, setShowTimeline] = React.useState(true);
		const [showCost, setShowCost] = React.useState(false);
		const [align, setAlign] = React.useState<"left" | "center" | "right">(
			"left"
		);

		return (
			<div className="border-border bg-background inline-flex items-center gap-1 rounded-md border px-2 py-1.5">
				<Toggle
					variant="outline"
					size="sm"
					pressed={showTimeline}
					onPressedChange={(v) => setShowTimeline(Boolean(v))}
				>
					Timeline
				</Toggle>
				<Toggle
					variant="outline"
					size="sm"
					pressed={showCost}
					onPressedChange={(v) => setShowCost(Boolean(v))}
				>
					Cost
				</Toggle>
				<div
					className="bg-border mx-1 h-4 w-px"
					role="separator"
					aria-orientation="vertical"
				/>
				<Toggle
					variant="default"
					size="sm"
					pressed={align === "left"}
					onPressedChange={() => setAlign("left")}
					aria-label="Align left"
				>
					<AlignLeft />
				</Toggle>
				<Toggle
					variant="default"
					size="sm"
					pressed={align === "center"}
					onPressedChange={() => setAlign("center")}
					aria-label="Align center"
				>
					<AlignCenter />
				</Toggle>
				<Toggle
					variant="default"
					size="sm"
					pressed={align === "right"}
					onPressedChange={() => setAlign("right")}
					aria-label="Align right"
				>
					<AlignRight />
				</Toggle>
			</div>
		);
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

/**
 * Long labels truncate gracefully — `Toggle` uses `whitespace-nowrap`
 * internally. Pair with a `min-w-*` or a fixed-width container when
 * overflow must be clipped.
 */
export const LongLabel: Story = {
	name: "Long label (truncation)",
	render: () => (
		<div className="flex flex-col gap-3">
			<Toggle variant="outline">Production traces — zenml-eu-central</Toggle>
			<Toggle variant="pill" defaultPressed>
				Production traces — zenml-eu-central
			</Toggle>
			<div className="w-48 overflow-hidden">
				<Toggle variant="outline" className="max-w-full truncate">
					Production traces — zenml-eu-central
				</Toggle>
			</div>
		</div>
	),
};
