/// <reference types="vitest/config" />
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import { envSchema } from "./src/modules/root/domain/env-schema";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const parsedEnv = envSchema.parse(env);

	const backendUrl = parsedEnv.VITE_BACKEND_URL;

	return {
		test: {
			environment: "jsdom",
			include: ["src/**/*.spec.ts", "src/**/*.spec.tsx"],
		},
		server: {
			proxy: {
				"/api": {
					target: backendUrl,
					changeOrigin: true,
					secure: false,
				},
			},
			watch: {
				ignored: ["**/dist/**", "**/.playwright-mcp/**", "**/node_modules/**"],
			},
		},
		resolve: {
			tsconfigPaths: true,
		},
		plugins: [
			tanstackRouter({
				target: "react",
				autoCodeSplitting: true,
			}),
			react(),
			babel({ presets: [reactCompilerPreset()] }),
			tailwindcss(),
			svgr(),
		],
	};
});
