"use client";
// WebGL grain-gradient backdrop with palette + theme variants. Two
// discriminators (`palette`, `theme`), one lookup. Palette data lives in
// `./backdrop-palettes` so the hex values can be shared with non-component
// consumers without tripping the react-refresh "components-only" rule.
//
// The component itself is theme-agnostic — it can't read the page's dark
// class without violating the `src/ui/` external-system-read rule. Callers
// pass `theme` explicitly (see `OnboardingBackdrop` for the wired pattern).
//
// Same reason this stays prop-driven for motion: callers pass `animate={false}`
// (driven by useReducedMotion at the page level) to freeze the shader for
// reduced-motion / battery, since the gate forbids hooks/external-state reads.
import { GrainGradient } from "@paper-design/shaders-react";
import { cn } from "../../lib/utils";
import {
	BACKDROP_PALETTES,
	type Palette,
	type PaletteTheme,
} from "../../lib/backdrop-palettes";

export function GrainGradientBg({
	palette = "sage",
	theme = "light",
	animate = true,
	position = "fixed",
}: {
	palette?: Palette;
	theme?: PaletteTheme;
	animate?: boolean;
	/**
	 * `fixed` (default) covers the whole viewport behind the page (`-z-10`).
	 * `absolute` scopes the shader to the nearest positioned ancestor so it can
	 * fill a single panel (e.g. the provisioning "while you wait" column).
	 */
	position?: "fixed" | "absolute";
}) {
	const { colors, background } = BACKDROP_PALETTES[palette][theme];
	return (
		<div
			className={cn(
				"overflow-hidden",
				position === "fixed" ? "fixed inset-0 -z-10" : "absolute inset-0"
			)}
		>
			<GrainGradient
				speed={animate ? 1 : 0}
				scale={4}
				rotation={0}
				offsetX={-0.56}
				offsetY={0}
				softness={1}
				intensity={0.74}
				noise={0.05}
				shape="blob"
				colors={colors}
				// `@paper-design/shaders-react` rejects "transparent" — needs alpha-hex.
				colorBack="#00000000"
				className="size-full"
				style={{ backgroundColor: background }}
			/>
		</div>
	);
}
