import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
	addons: [
		"@storybook/addon-docs",
		"@storybook/addon-vitest",
		"@storybook/addon-a11y",
		"@storybook/addon-designs",
	],
	framework: "@storybook/react-vite",
	async viteFinal(viteConfig) {
		const { mergeConfig } = await import("vite");
		const tailwindcss = (await import("@tailwindcss/vite")).default;
		return mergeConfig(viteConfig, {
			plugins: [tailwindcss()],
		});
	},
};

export default config;
