import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

import { playwright } from "@vitest/browser-playwright";

const dirname =
	typeof __dirname !== "undefined"
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	resolve: {
		dedupe: ["react", "react-dom"],
	},
	optimizeDeps: {
		include: [
			"@base-ui/react/collapsible",
			"@base-ui/react/merge-props",
			"@base-ui/react/progress",
			"@base-ui/react/use-render",
			"class-variance-authority",
			"clsx",
			"lucide-react",
			"react",
			"react-dom/client",
			"tailwind-merge",
		],
	},
	test: {
		projects: [
			{
				// Component browser specs (*.browser.spec.tsx) in real Chromium.
				test: {
					name: "client",
					expect: { requireAssertions: true },
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: "chromium", headless: true }],
					},
					include: ["src/**/*.browser.{test,spec}.{js,ts,jsx,tsx}"],
					exclude: ["src/lib/server/**"],
				},
			},
			{
				// Node-side tests and guards (e.g. story coverage: every component
				// must ship colocated stories — see src/storybook/story-coverage.test.ts).
				test: {
					name: "unit",
					environment: "node",
					expect: { requireAssertions: true },
					include: ["src/**/*.{test,spec}.{js,ts}"],
					exclude: ["src/**/*.browser.{test,spec}.{js,ts,jsx,tsx}"],
				},
			},
			{
				extends: true,
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					storybookTest({ configDir: path.join(dirname, ".storybook") }),
				],
				test: {
					name: "storybook",
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({}),
						instances: [{ browser: "chromium" }],
					},
				},
			},
		],
	},
});
