import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLeft } from "lucide-react";

import { NavbarBrandSlot } from "./NavbarBrandSlot";
import { BrandMarkTile } from "./BrandMarkTile";
import { IconButton } from "../primitives/icon-button";

const meta: Meta<typeof NavbarBrandSlot> = {
	title: "Components/NavbarBrandSlot",
	component: NavbarBrandSlot,
	parameters: {
		// Wrap in a mock navbar background so border-r and negative margin are visible.
		layout: "padded",
	},
};

export default meta;
type Story = StoryObj<typeof NavbarBrandSlot>;

// The default render is a plain <div> — the slot just positions its children.
export const Default: Story = {
	render: () => (
		<div className="bg-card border-border flex h-12 items-center overflow-hidden rounded-md border px-5">
			<NavbarBrandSlot>
				<BrandMarkTile brand="zenml" />
			</NavbarBrandSlot>
		</div>
	),
};

// NavbarBrandSlot accepts a `render` prop to swap the root element. In the
// live navbar, `render={<a href="/" aria-label="..." />}` makes the tile a
// home link. Show what that produces without importing the router.
export const AsLink: Story = {
	name: "As anchor link",
	render: () => (
		<div className="bg-card border-border flex h-12 items-center overflow-hidden rounded-md border px-5">
			<NavbarBrandSlot render={<a href="/" aria-label="Go to home" />}>
				<BrandMarkTile brand="kitaru" />
			</NavbarBrandSlot>
			<span className="text-muted-foreground ml-2 text-xs">
				Root element is an <code>&lt;a&gt;</code> — click navigates to /
			</span>
		</div>
	),
};

// Both brand variants inside the slot, in a realistic two-navbar mock.
export const BothBrands: Story = {
	name: "Both brand variants",
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
				<span className="text-muted-foreground text-sm">
					production-eu-central / traces / exec_7c3b
				</span>
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
				<span className="text-muted-foreground text-sm">
					acme-org / kitaru-us-west / pipelines
				</span>
			</div>
		</div>
	),
};

// The slot uses -ml-5 to eat the navbar's px-5 padding so the tile sits flush
// to the container edge. This story makes the effect visible with a colored
// background boundary.
export const EdgeFlushBehavior: Story = {
	name: "Edge-flush behavior",
	render: () => (
		<div className="space-y-3">
			<p className="text-muted-foreground text-xs">
				The slot uses <code>-ml-5</code> to eat the navbar's <code>px-5</code>{" "}
				padding, placing the tile flush with the container's left edge.
			</p>
			<div className="bg-card border-border flex h-12 items-center gap-2 overflow-hidden rounded-md border px-5 outline outline-2 outline-offset-2 outline-blue-400">
				<NavbarBrandSlot>
					<BrandMarkTile brand="zenml" />
				</NavbarBrandSlot>
				<span className="text-muted-foreground text-sm">
					rest of navbar content
				</span>
			</div>
		</div>
	),
};
