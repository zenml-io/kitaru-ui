import { LOG_LEVEL_SHORT_NAMES, type LoggingLevel } from "../domain/log-entry";

type LogLevelStyle = {
	pill: string;
	label: string;
};

const MUTED_PILL = "bg-muted text-muted-foreground";

export const LOG_LEVEL_STYLES: Record<LoggingLevel, LogLevelStyle> = {
	0: { pill: MUTED_PILL, label: LOG_LEVEL_SHORT_NAMES[0] },
	10: { pill: MUTED_PILL, label: LOG_LEVEL_SHORT_NAMES[10] },
	20: { pill: MUTED_PILL, label: LOG_LEVEL_SHORT_NAMES[20] },
	30: {
		pill: "bg-warning/15 text-warning",
		label: LOG_LEVEL_SHORT_NAMES[30],
	},
	40: {
		pill: "bg-destructive/15 text-destructive",
		label: LOG_LEVEL_SHORT_NAMES[40],
	},
	50: {
		pill: "bg-destructive/25 text-destructive",
		label: LOG_LEVEL_SHORT_NAMES[50],
	},
};
