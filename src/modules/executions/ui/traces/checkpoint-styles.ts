const checkpointStyles: Record<
	string,
	{ fill: string; surface: string; text: string }
> = {
	flow: {
		fill: "bg-muted-foreground",
		surface: "bg-muted",
		text: "text-muted-foreground",
	},
	llm: {
		fill: "bg-primary",
		surface: "bg-primary/10",
		text: "text-primary",
	},
	llm_call: {
		fill: "bg-primary",
		surface: "bg-primary/10",
		text: "text-primary",
	},
	checkpoint: {
		fill: "bg-info",
		surface: "bg-muted",
		text: "text-info",
	},
	tool: {
		fill: "bg-span-tool",
		surface: "bg-secondary",
		text: "text-span-tool",
	},
	tool_call: {
		fill: "bg-span-tool",
		surface: "bg-secondary",
		text: "text-span-tool",
	},
	wait: {
		fill: "bg-warning",
		surface: "bg-warning/15",
		text: "text-warning",
	},
	sleep: {
		fill: "bg-span-sleep",
		surface: "bg-muted",
		text: "text-muted-foreground",
	},
	parallel: {
		fill: "bg-info",
		surface: "bg-info/15",
		text: "text-info",
	},
};

const defaultCheckpointStyle = {
	fill: "bg-muted-foreground",
	surface: "bg-muted",
	text: "text-muted-foreground",
};

export function getCheckpointFillClass(type: string) {
	return (checkpointStyles[type] ?? defaultCheckpointStyle).fill;
}

export function getCheckpointSurfaceClass(type: string) {
	return (checkpointStyles[type] ?? defaultCheckpointStyle).surface;
}

export function getCheckpointTextClass(type: string) {
	return (checkpointStyles[type] ?? defaultCheckpointStyle).text;
}
