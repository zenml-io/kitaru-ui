import React, { useEffect } from "react";
import type { Decorator, Preview } from "@storybook/react-vite";

import { TooltipProvider } from "../src/primitives/tooltip/tooltip";

// The raw stylesheet, not the "@zenml/hashi/globals.css" consumer entry:
// the consumer entry excludes *.stories.tsx from the Tailwind scan, while
// stories here need their layout utilities compiled.
import "../src/styles/globals.css";
// The legacy Pro brand is a separate entry so it does not ship to consumers
// that never use it. It MUST be imported after globals.css: its blocks rely on
// source order to outrank the :root ZenML tokens.
import "../src/styles/zenml-pro-legacy.css";

/**
 * Hashi ships three brands: ZenML at `:root` and Kitaru at
 * `[data-app="kitaru"]` in globals.css, plus ZenML Pro (legacy) at
 * `[data-app="zenml-pro"]` in the stylesheet imported above. Dark mode uses the
 * `.dark` class for ZenML and Kitaru. ZenML Pro (legacy) is light-only, so the
 * decorator removes `.dark` whenever it is selected. All three are applied to
 * <html> so every token and the `body` base styles respond.
 */
const withBrandAndMode: Decorator = (Story, context) => {
	const brand = context.globals.brand as string;
	const mode = context.globals.mode as string;

	useEffect(() => {
		const root = document.documentElement;
		if (brand === "zenml") {
			root.removeAttribute("data-app");
		} else {
			root.setAttribute("data-app", brand);
		}
		root.classList.toggle("dark", brand !== "zenml-pro" && mode === "dark");
	}, [brand, mode]);

	return <Story />;
};

// Both consuming apps mount a single TooltipProvider at the root; mirror that
// here so stories never need their own.
const withTooltipProvider: Decorator = (Story) => (
	<TooltipProvider>
		<Story />
	</TooltipProvider>
);

const preview: Preview = {
	globalTypes: {
		brand: {
			description:
				"Brand cascade (ZenML at :root, Kitaru and light-only ZenML Pro via [data-app])",
			toolbar: {
				title: "Brand",
				icon: "paintbrush",
				items: [
					{ value: "zenml", title: "ZenML" },
					{ value: "kitaru", title: "Kitaru" },
					{ value: "zenml-pro", title: "ZenML Pro (legacy)" },
				],
				dynamicTitle: true,
			},
		},
		mode: {
			description: "Color mode",
			toolbar: {
				title: "Mode",
				icon: "circlehollow",
				items: [
					{ value: "light", title: "Light", icon: "sun" },
					{ value: "dark", title: "Dark", icon: "moon" },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: {
		brand: "zenml",
		mode: "light",
	},
	decorators: [withBrandAndMode, withTooltipProvider],
	parameters: {
		layout: "centered",
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: { disable: true },
		// Run axe checks as part of every story test (vitest addon) and fail
		// on violations. Per-story opt-down: parameters.a11y.test = "todo".
		a11y: { test: "error" },
	},
	tags: ["autodocs"],
};

export default preview;
