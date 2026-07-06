export type Palette = "sage" | "orange";
export type PaletteTheme = "light" | "dark";

type PaletteHalf = {
	colors: [string, string, string, string];
	background: string;
};

export const BACKDROP_PALETTES: Record<
	Palette,
	Record<PaletteTheme, PaletteHalf>
> = {
	sage: {
		light: {
			colors: ["#F6F9F1", "#FAF8F4", "#D8DDD0", "#F6F9F1"],
			background: "#FAF8F4",
		},
		dark: {
			colors: ["#243029", "#1F2A22", "#3A5443", "#243029"],
			background: "#1F2A22",
		},
	},
	orange: {
		light: {
			colors: ["#FCE9D6", "#FAF8F4", "#F1C9A0", "#FCE9D6"],
			background: "#FAF8F4",
		},
		dark: {
			colors: ["#3A352F", "#34302B", "#7A4F30", "#3A352F"],
			background: "#34302B",
		},
	},
};
