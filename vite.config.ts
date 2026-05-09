/// <reference types="vitest/config" />
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import { envSchema } from "./src/modules/root/domain/env-schema";

const PROJECT_SCOPED_LIST_ENDPOINTS = new Set([
	"/api/v1/pipelines",
	"/api/v1/runs",
	"/api/v1/pipeline_snapshots",
]);

function addDevProjectScope(path: string, projectNameOrId?: string): string {
	if (!projectNameOrId) {
		return path;
	}

	const url = new URL(path, "http://localhost");
	if (
		!PROJECT_SCOPED_LIST_ENDPOINTS.has(url.pathname) ||
		url.searchParams.has("project_name_or_id")
	) {
		return path;
	}

	url.searchParams.set("project_name_or_id", projectNameOrId);
	return `${url.pathname}${url.search}${url.hash}`;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const parsedEnv = envSchema.parse(env);

	const backendUrl = parsedEnv.VITE_BACKEND_URL;
	const devProxyCookie =
		parsedEnv.DEV_PROXY_COOKIE ?? process.env.DEV_PROXY_COOKIE;
	const devProxyAuthorization =
		parsedEnv.DEV_PROXY_AUTHORIZATION ?? process.env.DEV_PROXY_AUTHORIZATION;
	const devProxyCsrfToken =
		parsedEnv.DEV_PROXY_CSRF_TOKEN ?? process.env.DEV_PROXY_CSRF_TOKEN;
	const devProxyProjectNameOrId =
		parsedEnv.DEV_PROXY_PROJECT_NAME_OR_ID ??
		process.env.DEV_PROXY_PROJECT_NAME_OR_ID;

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
					rewrite: (path) => addDevProjectScope(path, devProxyProjectNameOrId),
					configure(proxy) {
						proxy.on("proxyReq", (proxyReq) => {
							if (devProxyCookie) {
								proxyReq.setHeader("Cookie", devProxyCookie);
							}
							if (devProxyAuthorization) {
								proxyReq.setHeader("Authorization", devProxyAuthorization);
							}
							if (devProxyCsrfToken) {
								proxyReq.setHeader("X-CSRF-Token", devProxyCsrfToken);
							}
						});
					},
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
