import type { Meta, StoryObj } from "@storybook/react-vite";

import { ZenmlMarkIcon } from "./ZenmlMarkIcon";

const meta: Meta<typeof ZenmlMarkIcon> = {
	title: "Components/ZenmlMarkIcon",
	component: ZenmlMarkIcon,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=241-7",
		},
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof ZenmlMarkIcon>;

export const Default: Story = {};

// The mark is used at a fixed size inside BrandMarkTile (size-7 / 28px).
// Show it at that canonical size alongside other common scales.
export const Sizes: Story = {
	render: () => (
		<div className="flex items-end gap-6">
			<div className="flex flex-col items-center gap-2">
				<ZenmlMarkIcon className="size-4" />
				<span className="text-muted-foreground text-xs">size-4</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<ZenmlMarkIcon className="size-7" />
				<span className="text-muted-foreground text-xs">
					size-7 (tile canonical)
				</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<ZenmlMarkIcon className="size-10" />
				<span className="text-muted-foreground text-xs">size-10</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<ZenmlMarkIcon className="size-16" />
				<span className="text-muted-foreground text-xs">size-16</span>
			</div>
		</div>
	),
};

// The mark inherits color via currentColor. Show on dark, light, and accent backgrounds.
export const ColorInheritance: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<div className="bg-background border-border flex size-16 items-center justify-center rounded-lg border">
				<ZenmlMarkIcon className="text-foreground size-8" />
			</div>
			<div className="bg-primary flex size-16 items-center justify-center rounded-lg">
				<ZenmlMarkIcon className="text-primary-foreground size-8" />
			</div>
			<div className="flex size-16 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
				<ZenmlMarkIcon className="size-8 text-green-800 dark:text-green-200" />
			</div>
		</div>
	),
};

// This is the mark as it appears inside the live BrandMarkTile — the tile
// sets the background via --brand-mark-bg CSS variable and the icon color
// via --brand-mark-fg. This story approximates that context without
// reproducing the tile component itself.
export const InTileContext: Story = {
	name: "In tile context (approximated)",
	render: () => (
		<div className="flex items-center gap-2">
			<div
				data-app-mark="zenml"
				className="flex size-12 items-center justify-center bg-(--brand-mark-bg) text-(--brand-mark-fg)"
			>
				<ZenmlMarkIcon className="size-7" />
			</div>
			<span className="text-muted-foreground text-xs">
				Driven by <code>--brand-mark-bg</code> / <code>--brand-mark-fg</code>{" "}
				tokens set by <code>data-app-mark="zenml"</code>
			</span>
		</div>
	),
};
