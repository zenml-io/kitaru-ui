import { useState } from "react";
import type { LogEntry, LoggingLevel } from "../domain/log-entry";
import { useLogSearch } from "./use-log-search";

// NOTSET (0) means "show everything" — "level >= 0" matches every entry, and
// entries without a level default to 0 for comparison.
const DEFAULT_LEVEL: LoggingLevel = 0;

// Standard logging semantics: selecting "Warning" shows Warning + Error + Critical.
export function useLogsFilter(logs: LogEntry[]) {
	const [selectedLevel, setSelectedLevel] =
		useState<LoggingLevel>(DEFAULT_LEVEL);

	const filteredLogs = logs.filter(
		(entry) => (entry.level ?? 0) >= selectedLevel
	);
	const searchState = useLogSearch(filteredLogs);

	return {
		filteredLogs,
		selectedLevel,
		setSelectedLevel,
		...searchState,
	};
}
