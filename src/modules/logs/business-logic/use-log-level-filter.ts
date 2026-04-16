import { useMemo, useState } from "react";
import type { LogEntry, LoggingLevel } from "../domain/log-entry";

export type LevelFilterValue = LoggingLevel | "all";

const DEFAULT_LEVEL: LoggingLevel = 20;

export function useLogLevelFilter(logs: LogEntry[]) {
	const [selectedLevel, setSelectedLevel] =
		useState<LevelFilterValue>(DEFAULT_LEVEL);

	const filteredLogs = useMemo(() => {
		if (selectedLevel === "all") return logs;
		return logs.filter(
			(entry) => entry.level != null && entry.level >= selectedLevel
		);
	}, [logs, selectedLevel]);

	return { filteredLogs, selectedLevel, setSelectedLevel };
}
