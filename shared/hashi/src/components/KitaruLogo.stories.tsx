import type { Meta, StoryObj } from "@storybook/react-vite";

import { KitaruLogo } from "./KitaruLogo";

const meta: Meta<typeof KitaruLogo> = {
	title: "Components/KitaruLogo",
	component: KitaruLogo,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof KitaruLogo>;

export const Default: Story = {};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">
					Default (intrinsic 513 × 82)
				</span>
				<KitaruLogo className="h-8 w-auto" />
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">h-6 — compact nav</span>
				<KitaruLogo className="h-6 w-auto" />
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">
					h-10 — splash / auth
				</span>
				<KitaruLogo className="h-10 w-auto" />
			</div>
		</div>
	),
};

// The wordmark text + ring icon both use `fill="currentColor"`, but the ring
// carries an `animate-ring-spin` class — you'll see it rotating here.
export const SpinningRing: Story = {
	name: "Spinning ring (live)",
	render: () => (
		<div className="flex flex-col items-center gap-2">
			<KitaruLogo className="h-10 w-auto" />
			<span className="text-muted-foreground text-xs">
				The torii ring animates via <code>animate-ring-spin</code>
			</span>
		</div>
	),
};

// Like ZenmlLogo, the entire mark inherits currentColor.
export const ColorInheritance: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">
					Inherits foreground (default)
				</span>
				<KitaruLogo className="h-8 w-auto" />
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">text-primary</span>
				<KitaruLogo className="text-primary h-8 w-auto" />
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">
					text-muted-foreground
				</span>
				<KitaruLogo className="text-muted-foreground h-8 w-auto" />
			</div>
		</div>
	),
};

// Typical placement on an auth/splash card surface.
export const OnSplashCard: Story = {
	render: () => (
		<div className="bg-card border-border flex h-40 w-96 flex-col items-center justify-center gap-4 rounded-lg border">
			<KitaruLogo className="h-8 w-auto" />
			<p className="text-muted-foreground text-sm">Sign in to your workspace</p>
		</div>
	),
};
