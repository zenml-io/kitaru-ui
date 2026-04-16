import { useState } from "react";
import type { LogEntry, LogLevelFilter } from "../domain/log-entry";

const DEFAULT_LEVEL: LogLevelFilter = "all";

// Standard logging semantics: selecting "Warning" shows Warning + Error + Critical.
export function useLogLevelFilter(logs: LogEntry[]) {
	const [selectedLevel, setSelectedLevel] =
		useState<LogLevelFilter>(DEFAULT_LEVEL);

	const filteredLogs =
		selectedLevel === "all"
			? logs
			: logs.filter(
					(entry) => entry.level != null && entry.level >= selectedLevel
				);

	return { filteredLogs, selectedLevel, setSelectedLevel };
}
