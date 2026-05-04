type MonacoThemeData = import("monaco-editor").editor.IStandaloneThemeData;
type MonacoNamespace = typeof import("monaco-editor");

const kitaruLightTheme: MonacoThemeData = {
	base: "vs",
	inherit: true,
	rules: [
		{ token: "comment", foreground: "6B6154", fontStyle: "italic" },
		{ token: "string", foreground: "1F6A34" },
		{ token: "string.key.json", foreground: "3F3225" },
		{ token: "number", foreground: "925718" },
		{ token: "keyword", foreground: "8E3E2A" },
		{ token: "keyword.json", foreground: "8E3E2A" },
		{ token: "delimiter", foreground: "6D6050" },
		{ token: "delimiter.bracket", foreground: "6D6050" },
		{ token: "operator", foreground: "5F5447" },
		{ token: "type", foreground: "62408A" },
		{ token: "tag", foreground: "8E3E2A" },
		{ token: "metatag", foreground: "8E3E2A" },
		{ token: "attribute.name", foreground: "3F3225" },
	],
	colors: {
		"editor.background": "#F9F8F4",
		"editor.foreground": "#25211B",
		"editorLineNumber.foreground": "#8E8578",
		"editorLineNumber.activeForeground": "#4E463A",
		"editorGutter.background": "#F9F8F4",
		"editorCursor.foreground": "#A65A42",
		"editor.selectionBackground": "#D0B89AB3",
		"editor.inactiveSelectionBackground": "#DED0BBA6",
		"editor.lineHighlightBackground": "#E6E0D3AA",
		"editorIndentGuide.background1": "#C9BEAF99",
		"editorIndentGuide.activeBackground1": "#8B7D6A99",
		"editorWidget.background": "#EFEBE2",
		"editorWidget.border": "#BDAF9A",
		"editorSuggestWidget.background": "#EFEBE2",
		"editorSuggestWidget.border": "#BDAF9A",
		"editorSuggestWidget.selectedBackground": "#D8CCBAA6",
		"editorHoverWidget.background": "#EFEBE2",
		"editorHoverWidget.border": "#BDAF9A",
		"editorError.foreground": "#A62E2A",
		"editorWarning.foreground": "#A6721E",
	},
};

const kitaruDarkTheme: MonacoThemeData = {
	base: "vs-dark",
	inherit: true,
	rules: [
		{ token: "comment", foreground: "B3A792", fontStyle: "italic" },
		{ token: "string", foreground: "A8E5B8" },
		{ token: "string.key.json", foreground: "EBC9A1" },
		{ token: "number", foreground: "F2CD8E" },
		{ token: "keyword", foreground: "F2B295" },
		{ token: "keyword.json", foreground: "F2B295" },
		{ token: "delimiter", foreground: "CBBCA7" },
		{ token: "delimiter.bracket", foreground: "CBBCA7" },
		{ token: "operator", foreground: "DACCB7" },
		{ token: "type", foreground: "E5C8F7" },
		{ token: "tag", foreground: "F2B295" },
		{ token: "metatag", foreground: "F2B295" },
		{ token: "attribute.name", foreground: "EBC9A1" },
	],
	colors: {
		"editor.background": "#272420",
		"editor.foreground": "#F4EFE6",
		"editorLineNumber.foreground": "#978B7A",
		"editorLineNumber.activeForeground": "#E1D6C6",
		"editorGutter.background": "#272420",
		"editorCursor.foreground": "#E2A383",
		"editor.selectionBackground": "#7A5F45B3",
		"editor.inactiveSelectionBackground": "#5F4A378F",
		"editor.lineHighlightBackground": "#3A352F99",
		"editorIndentGuide.background1": "#6F665B99",
		"editorIndentGuide.activeBackground1": "#A5968199",
		"editorWidget.background": "#2E2A26",
		"editorWidget.border": "#786E62",
		"editorSuggestWidget.background": "#2E2A26",
		"editorSuggestWidget.border": "#786E62",
		"editorSuggestWidget.selectedBackground": "#5A4D40B3",
		"editorHoverWidget.background": "#2E2A26",
		"editorHoverWidget.border": "#786E62",
		"editorError.foreground": "#FFB3AC",
		"editorWarning.foreground": "#F6CD8D",
	},
};

export function getMonacoThemeName(resolvedTheme: string | undefined): string {
	return resolvedTheme === "dark" ? "kitaru-dark" : "kitaru-light";
}

export function registerMonacoThemes(monaco: MonacoNamespace): void {
	monaco.editor.defineTheme("kitaru-light", kitaruLightTheme);
	monaco.editor.defineTheme("kitaru-dark", kitaruDarkTheme);
}
