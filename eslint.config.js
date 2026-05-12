import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	globalIgnores(["dist", "src/shared/api/types.ts", "src/routeTree.gen.ts"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite({
				extraHOCs: ["createFileRoute", "createRootRouteWithContext"],
			}),
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			"eslint-comments/no-unused-disable": "off",
		},
	},
	{
		files: ["e2e/**/*.ts"],
		rules: {
			"react-hooks/rules-of-hooks": "off",
		},
	},
]);
