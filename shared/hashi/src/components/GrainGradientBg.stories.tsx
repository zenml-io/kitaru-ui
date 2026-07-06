import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@zenml/hashi/primitives/button";
import { Card } from "@zenml/hashi/primitives/card";

import { GrainGradientBg } from "./GrainGradientBg";

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * A WebGL grain-gradient backdrop for onboarding and auth surfaces. Two
 * discriminators pick the look: `palette` (`sage` for ZenML, `orange` for
 * Kitaru) and `theme` (`light` / `dark`) — the shader can't read the page's
 * dark class, so callers pass `theme` explicitly. `position="fixed"` (the
 * default) covers the whole viewport behind the page; these stories scope it to
 * a sized container with `position="absolute"`. Under headless Chromium the
 * WebGL canvas may render blank — that is expected; the stories verify it mounts
 * and stays accessible.
 */
const meta: Meta<typeof GrainGradientBg> = {
	title: "Components/GrainGradientBg",
	component: GrainGradientBg,
	args: {
		palette: "sage",
		theme: "light",
		animate: true,
		position: "absolute",
	},
	argTypes: {
		palette: {
			control: "inline-radio",
			options: ["sage", "orange"],
		},
		theme: {
			control: "inline-radio",
			options: ["light", "dark"],
		},
		position: { control: false },
	},
};

export default meta;
type Story = StoryObj<typeof GrainGradientBg>;

// Story-level frame (not on meta: decorators compose rather than replace, so a
// meta-level frame would also clip the grid/composed scenes below).
const framed = (Story: () => React.ReactNode) => (
	<div className="relative h-64 w-96 overflow-hidden rounded-lg border">
		<Story />
	</div>
);

// ─── Default (args-driven) ────────────────────────────────────────────────────

export const Default: Story = { decorators: [framed] };

// ─── Palette × theme matrix ───────────────────────────────────────────────────
// The four combinations that ship: sage (ZenML) and orange (Kitaru), each in
// its light and dark palette. `theme` is a prop, independent of the Storybook
// mode toolbar.

export const Themes: Story = {
	render: () => (
		<div className="grid grid-cols-2 gap-4">
			{(
				[
					{ palette: "sage", theme: "light", label: "sage / light" },
					{ palette: "sage", theme: "dark", label: "sage / dark" },
					{ palette: "orange", theme: "light", label: "orange / light" },
					{ palette: "orange", theme: "dark", label: "orange / dark" },
				] as const
			).map(({ palette, theme, label }) => (
				<div key={label} className="flex flex-col gap-1.5">
					<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
						{label}
					</span>
					<div className="relative h-40 w-56 overflow-hidden rounded-lg border">
						<GrainGradientBg
							palette={palette}
							theme={theme}
							position="absolute"
						/>
					</div>
				</div>
			))}
		</div>
	),
};

// ─── Static (reduced motion) ──────────────────────────────────────────────────
// Callers drive `animate` from `useReducedMotion` at the page level;
// `animate={false}` freezes the shader for reduced-motion and battery.

export const Static: Story = {
	decorators: [framed],
	args: {
		animate: false,
	},
};

// ─── Composed: auth screen backdrop ───────────────────────────────────────────
// The canonical usage — a centered auth card floating over the gradient, the
// way the Kitaru login screen composes it.

export const Composed: Story = {
	render: () => (
		<div className="relative flex h-[420px] w-[520px] items-center justify-center overflow-hidden rounded-lg border p-6">
			<GrainGradientBg palette="orange" theme="light" position="absolute" />
			<Card className="relative z-10 flex w-full max-w-xs flex-col gap-4 p-6 shadow-lg">
				<div className="flex flex-col gap-1 text-center">
					<h2 className="text-foreground text-lg font-semibold">
						Sign in to Kitaru
					</h2>
					<p className="text-muted-foreground text-sm">
						Continue to your workspace.
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Button variant="outline" className="w-full">
						Continue with GitHub
					</Button>
					<Button variant="outline" className="w-full">
						Continue with Google
					</Button>
				</div>
			</Card>
		</div>
	),
};
