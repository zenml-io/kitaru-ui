import type { LoggingLevel } from "../domain/log-entry";
import { LOG_LEVEL_SHORT_NAMES } from "../domain/log-entry";

type LogLevelStyle = {
	text: string;
	bg: string;
	label: string;
};

export const LOG_LEVEL_STYLES: Record<LoggingLevel, LogLevelStyle> = {
	0: {
		text: "text-muted-foreground",
		bg: "bg-muted-foreground/12",
		label: LOG_LEVEL_SHORT_NAMES[0],
	},
	10: {
		text: "text-muted-foreground",
		bg: "bg-muted-foreground/12",
		label: LOG_LEVEL_SHORT_NAMES[10],
	},
	20: {
		text: "text-info",
		bg: "bg-info/12",
		label: LOG_LEVEL_SHORT_NAMES[20],
	},
	30: {
		text: "text-warning",
		bg: "bg-warning/12",
		label: LOG_LEVEL_SHORT_NAMES[30],
	},
	40: {
		text: "text-destructive",
		bg: "bg-destructive/12",
		label: LOG_LEVEL_SHORT_NAMES[40],
	},
	50: {
		text: "text-destructive",
		bg: "bg-destructive/12",
		label: LOG_LEVEL_SHORT_NAMES[50],
	},
};
