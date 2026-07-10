import type { Meta, StoryObj } from "@storybook/react-vite";

import { KitaruMarkIcon } from "./KitaruMarkIcon";

const meta: Meta<typeof KitaruMarkIcon> = {
	title: "Components/KitaruMarkIcon",
	component: KitaruMarkIcon,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=241-13",
		},
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof KitaruMarkIcon>;

export const Default: Story = {};

// Canonical size is size-7 (28px) as used inside BrandMarkTile.
export const Sizes: Story = {
	render: () => (
		<div className="flex items-end gap-6">
			<div className="flex flex-col items-center gap-2">
				<KitaruMarkIcon className="size-4" />
				<span className="text-muted-foreground text-xs">size-4</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<KitaruMarkIcon className="size-7" />
				<span className="text-muted-foreground text-xs">
					size-7 (tile canonical)
				</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<KitaruMarkIcon className="size-10" />
				<span className="text-muted-foreground text-xs">size-10</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<KitaruMarkIcon className="size-16" />
				<span className="text-muted-foreground text-xs">size-16</span>
			</div>
		</div>
	),
};

// The torii ring carries `animate-ring-spin` — you'll see it rotating here.
export const SpinningRing: Story = {
	name: "Spinning ring (live)",
	render: () => (
		<div className="flex flex-col items-center gap-2">
			<KitaruMarkIcon className="size-12" />
			<span className="text-muted-foreground text-xs">
				<code>animate-ring-spin</code> is always active — this is intentional
				brand motion
			</span>
		</div>
	),
};

// Color is driven by the parent via currentColor, same as ZenmlMarkIcon.
export const ColorInheritance: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<div className="bg-background border-border flex size-16 items-center justify-center rounded-full border">
				<KitaruMarkIcon className="text-foreground size-8" />
			</div>
			<div className="bg-primary flex size-16 items-center justify-center rounded-full">
				<KitaruMarkIcon className="text-primary-foreground size-8" />
			</div>
			<div className="flex size-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950">
				<KitaruMarkIcon className="size-8 text-orange-700 dark:text-orange-300" />
			</div>
		</div>
	),
};

// Approximates the live BrandMarkTile context (circular tile, brand tokens).
export const InTileContext: Story = {
	name: "In tile context (approximated)",
	render: () => (
		<div className="flex items-center gap-2">
			<div
				data-app-mark="kitaru"
				className="flex size-12 items-center justify-center bg-(--brand-mark-bg) text-(--brand-mark-fg)"
			>
				<KitaruMarkIcon className="size-7" />
			</div>
			<span className="text-muted-foreground text-xs">
				Driven by <code>--brand-mark-bg</code> / <code>--brand-mark-fg</code>{" "}
				tokens set by <code>data-app-mark="kitaru"</code>
			</span>
		</div>
	),
};
