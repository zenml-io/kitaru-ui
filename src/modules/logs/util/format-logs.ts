import type { LogEntry } from "../domain/log-entry";

/**
 * Joins log entries into a single newline-separated string suitable for
 * copy-to-clipboard or download.
 */
export function formatLogsForExport(entries: LogEntry[]): string {
	return entries.map((e) => e.originalEntry).join("\n");
}
