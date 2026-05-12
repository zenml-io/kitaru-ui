import type { ThemeRegistration } from "shiki/types";

export const kitaruLight: ThemeRegistration = {
	name: "kitaru-light",
	type: "light",
	colors: {
		"editor.background": "#00000000",
		"editor.foreground": "#3d2e1f",
	},
	settings: [
		{
			scope: ["comment", "punctuation.definition.comment"],
			settings: { foreground: "#8a7e72" },
		},
		{
			scope: ["keyword", "storage.type", "storage.modifier"],
			settings: { foreground: "#9a6224" },
		},
		{
			scope: ["constant", "constant.numeric", "constant.language"],
			settings: { foreground: "#b07020" },
		},
		{ scope: ["string", "string.quoted"], settings: { foreground: "#3a7a3a" } },
		{
			scope: ["entity.name.function", "support.function"],
			settings: { foreground: "#5c4a32" },
		},
		{
			scope: ["variable", "variable.parameter"],
			settings: { foreground: "#3d2e1f" },
		},
		{
			scope: ["entity.name.type", "support.type", "support.class"],
			settings: { foreground: "#7a5c30" },
		},
		{
			scope: ["meta.decorator", "punctuation.decorator"],
			settings: { foreground: "#9a6224" },
		},
		{ scope: ["keyword.operator"], settings: { foreground: "#8a7e72" } },
		{ scope: ["punctuation"], settings: { foreground: "#8a7e72" } },
		{
			scope: ["keyword.control.import", "keyword.control.from"],
			settings: { foreground: "#9a6224" },
		},
		{ scope: ["entity.name.tag"], settings: { foreground: "#9a6224" } },
		{
			scope: ["entity.other.attribute-name"],
			settings: { foreground: "#7a5c30" },
		},
		{
			scope: ["markup.heading"],
			settings: { foreground: "#3d2e1f", fontStyle: "bold" },
		},
		{ scope: ["markup.bold"], settings: { fontStyle: "bold" } },
		{ scope: ["markup.italic"], settings: { fontStyle: "italic" } },
	],
};

export const kitaruDark: ThemeRegistration = {
	name: "kitaru-dark",
	type: "dark",
	colors: {
		"editor.background": "#00000000",
		"editor.foreground": "#c8bfb4",
	},
	settings: [
		{
			scope: ["comment", "punctuation.definition.comment"],
			settings: { foreground: "#7a7268" },
		},
		{
			scope: ["keyword", "storage.type", "storage.modifier"],
			settings: { foreground: "#d4944a" },
		},
		{
			scope: ["constant", "constant.numeric", "constant.language"],
			settings: { foreground: "#d4944a" },
		},
		{ scope: ["string", "string.quoted"], settings: { foreground: "#7ab87a" } },
		{
			scope: ["entity.name.function", "support.function"],
			settings: { foreground: "#c8bfb4" },
		},
		{
			scope: ["variable", "variable.parameter"],
			settings: { foreground: "#c8bfb4" },
		},
		{
			scope: ["entity.name.type", "support.type", "support.class"],
			settings: { foreground: "#c4a060" },
		},
		{
			scope: ["meta.decorator", "punctuation.decorator"],
			settings: { foreground: "#d4944a" },
		},
		{ scope: ["keyword.operator"], settings: { foreground: "#7a7268" } },
		{ scope: ["punctuation"], settings: { foreground: "#7a7268" } },
		{
			scope: ["keyword.control.import", "keyword.control.from"],
			settings: { foreground: "#d4944a" },
		},
		{ scope: ["entity.name.tag"], settings: { foreground: "#d4944a" } },
		{
			scope: ["entity.other.attribute-name"],
			settings: { foreground: "#c4a060" },
		},
		{
			scope: ["markup.heading"],
			settings: { foreground: "#c8bfb4", fontStyle: "bold" },
		},
		{ scope: ["markup.bold"], settings: { fontStyle: "bold" } },
		{ scope: ["markup.italic"], settings: { fontStyle: "italic" } },
	],
};
