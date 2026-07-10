import type { Meta, StoryObj } from "@storybook/react-vite";

import { ZenmlLogo } from "./ZenmlLogo";

const meta: Meta<typeof ZenmlLogo> = {
	title: "Components/ZenmlLogo",
	component: ZenmlLogo,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=242-17",
		},
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof ZenmlLogo>;

export const Default: Story = {};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">
					Default (190 × 40 intrinsic)
				</span>
				<ZenmlLogo />
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">
					Constrained width — h-6
				</span>
				<ZenmlLogo className="h-6 w-auto" />
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">
					Constrained width — h-10
				</span>
				<ZenmlLogo className="h-10 w-auto" />
			</div>
		</div>
	),
};

// The logo uses `fill="currentColor"` throughout, so it inherits the text
// color and adapts to any surface without code changes.
export const ColorInheritance: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">
					Inherits foreground (default)
				</span>
				<ZenmlLogo className="h-8 w-auto" />
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">text-primary</span>
				<ZenmlLogo className="text-primary h-8 w-auto" />
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">
					text-muted-foreground
				</span>
				<ZenmlLogo className="text-muted-foreground h-8 w-auto" />
			</div>
		</div>
	),
};

// Typical splash / login placement: centered on a card surface.
export const OnSplashCard: Story = {
	render: () => (
		<div className="bg-card border-border flex h-40 w-80 flex-col items-center justify-center gap-4 rounded-lg border">
			<ZenmlLogo className="h-8 w-auto" />
			<p className="text-muted-foreground text-sm">Sign in to continue</p>
		</div>
	),
};
