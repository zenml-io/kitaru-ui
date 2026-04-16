import type { components } from "@/shared/api/openapi";

export type LogEntryApiType = components["schemas"]["LogEntry"];
export type LoggingLevel = components["schemas"]["LoggingLevels"];

/**
 * Domain log entry — API shape plus a pre-formatted `originalEntry` string
 * used for copy/download operations.
 */
export type LogEntry = LogEntryApiType & { originalEntry: string };

export const LOG_LEVEL_NAMES: Record<LoggingLevel, string> = {
	0: "NOTSET",
	10: "DEBUG",
	20: "INFO",
	30: "WARNING",
	40: "ERROR",
	50: "CRITICAL",
};

export const LOG_LEVEL_SHORT_NAMES: Record<LoggingLevel, string> = {
	0: "",
	10: "DEBUG",
	20: "INFO",
	30: "WARN",
	40: "ERROR",
	50: "CRIT",
};

/**
 * A half-open offset range [start, end) into a log message, used for both
 * search matches and highlight rendering.
 */
export type LogMessageRange = { start: number; end: number };
