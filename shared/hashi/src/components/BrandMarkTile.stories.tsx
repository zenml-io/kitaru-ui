import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLeft } from "lucide-react";

import { BrandMarkTile } from "./BrandMarkTile";
import { NavbarBrandSlot } from "./NavbarBrandSlot";

// Import IconButton inline to compose the mock navbar without reaching into
// app code — keep stories dependency-free from router / store.
import { IconButton } from "../primitives/icon-button";

const meta: Meta<typeof BrandMarkTile> = {
	title: "Components/BrandMarkTile",
	component: BrandMarkTile,
	args: {
		brand: "zenml",
	},
	argTypes: {
		brand: {
			control: "select",
			options: ["zenml", "kitaru"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof BrandMarkTile>;

export const Default: Story = {};

// Both brand variants side by side — ZenML gets a square tile, Kitaru gets
// a circle, driven by CSS tokens on the `data-app-mark` attribute.
export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-8">
			<div className="flex flex-col items-center gap-2">
				<BrandMarkTile brand="zenml" />
				<span className="text-muted-foreground text-xs">zenml (square)</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<BrandMarkTile brand="kitaru" />
				<span className="text-muted-foreground text-xs">kitaru (circle)</span>
			</div>
		</div>
	),
};

// BrandMarkTile is always 48×48 (size-12). Additional className is available
// for one-off overrides, but teams should not resize the tile in a navbar.
export const CustomClassName: Story = {
	name: "Custom className (override example)",
	render: () => (
		<div className="flex items-end gap-6">
			<div className="flex flex-col items-center gap-2">
				<BrandMarkTile brand="zenml" />
				<span className="text-muted-foreground text-xs">default (size-12)</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<BrandMarkTile brand="zenml" className="size-16" />
				<span className="text-muted-foreground text-xs">
					className="size-16"
				</span>
			</div>
		</div>
	),
};

// The tile's canonical home is the leftmost slot of the navbar. This mock
// matches the real NavbarBrandSlot composition used in the app shell so the
// showcase and live navbar stay visually in sync.
export const InMockNavbar: Story = {
	name: "In mock navbar",
	render: () => (
		<div className="flex flex-col gap-3">
			<div className="bg-card border-border flex h-12 items-center gap-2 overflow-hidden rounded-md border px-5">
				<NavbarBrandSlot>
					<BrandMarkTile brand="zenml" />
				</NavbarBrandSlot>
				<IconButton
					icon={<ArrowLeft className="size-4" />}
					label="Go back"
					variant="ghost"
					size="icon-sm"
				/>
				<span className="text-muted-foreground text-sm">ZenML context</span>
			</div>
			<div className="bg-card border-border flex h-12 items-center gap-2 overflow-hidden rounded-md border px-5">
				<NavbarBrandSlot>
					<BrandMarkTile brand="kitaru" />
				</NavbarBrandSlot>
				<IconButton
					icon={<ArrowLeft className="size-4" />}
					label="Go back"
					variant="ghost"
					size="icon-sm"
				/>
				<span className="text-muted-foreground text-sm">Kitaru context</span>
			</div>
		</div>
	),
};

// Token reference: the tile background and icon color are driven by CSS
// custom properties set via the data-app-mark attribute.
export const TokenReference: Story = {
	name: "Token reference",
	render: () => (
		<div className="space-y-3">
			<div className="flex items-center gap-3">
				<BrandMarkTile brand="zenml" />
				<div className="text-xs">
					<p className="font-medium">ZenML</p>
					<p className="text-muted-foreground">
						<code>--brand-mark-bg</code>: zen-green-porcelain →
						zen-green-granite (dark)
					</p>
					<p className="text-muted-foreground">
						<code>--brand-mark-fg</code>: icon color via{" "}
						<code>currentColor</code>
					</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<BrandMarkTile brand="kitaru" />
				<div className="text-xs">
					<p className="font-medium">Kitaru</p>
					<p className="text-muted-foreground">
						<code>--brand-mark-bg</code>: lightest orange surface → deeper warm
						tone (dark)
					</p>
					<p className="text-muted-foreground">
						<code>--brand-mark-fg</code>: icon color via{" "}
						<code>currentColor</code>
					</p>
				</div>
			</div>
		</div>
	),
};
