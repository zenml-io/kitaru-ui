import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	// Stories live next to the component they document. Cover the app and
	// @zenml/shared-kitaru (which has no Storybook of its own). @zenml/hashi
	// component stories are owned by hashi's own Storybook (shared/hashi/.storybook).
	stories: [
		"../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
		"../../../shared/kitaru/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
	],
	addons: [],
	framework: "@storybook/react-vite",
};
export default config;
