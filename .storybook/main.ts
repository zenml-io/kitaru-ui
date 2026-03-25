import type { StorybookConfig } from "@storybook/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [],
	framework: "@storybook/react-vite",
	viteFinal: (config) =>
		mergeConfig(config, {
			plugins: [tsconfigPaths()],
		}),
};
export default config;
