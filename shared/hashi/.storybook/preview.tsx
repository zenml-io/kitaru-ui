import React, { useEffect } from "react";
import type { Decorator, Preview } from "@storybook/react-vite";

import { TooltipProvider } from "../src/primitives/tooltip/tooltip";

// The raw stylesheet, not the "@zenml/hashi/globals.css" consumer entry:
// the consumer entry excludes *.stories.tsx from the Tailwind scan, while
// stories here need their layout utilities compiled.
import "../src/styles/globals.css";

/**
 * Hashi ships two brands in one CSS cascade: ZenML at `:root` and Kitaru as
 * the `[data-app="kitaru"]` deviation. Dark mode is the `.dark` class. Both
 * are applied to <html> so every token (and the `body` base styles) respond.
 */
const withBrandAndMode: Decorator = (Story, context) => {
	const brand = context.globals.brand as string;
	const mode = context.globals.mode as string;

	useEffect(() => {
		const root = document.documentElement;
		if (brand === "kitaru") {
			root.setAttribute("data-app", "kitaru");
		} else {
			root.removeAttribute("data-app");
		}
		root.classList.toggle("dark", mode === "dark");
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
			description: "Brand cascade (ZenML at :root, Kitaru via [data-app])",
			toolbar: {
				title: "Brand",
				icon: "paintbrush",
				items: [
					{ value: "zenml", title: "ZenML" },
					{ value: "kitaru", title: "Kitaru" },
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
