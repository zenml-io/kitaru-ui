import { defineConfig, devices } from "@playwright/test";
import { E2E_BASE_URL, E2E_PORT } from "./e2e/constants";

export default defineConfig({
	testDir: "./e2e/specs",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? [["html"], ["github"]] : "list",
	use: {
		baseURL: E2E_BASE_URL,
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
		permissions: ["clipboard-read", "clipboard-write"],
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		command: `pnpm preview --port ${E2E_PORT} --strictPort`,
		url: E2E_BASE_URL,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
