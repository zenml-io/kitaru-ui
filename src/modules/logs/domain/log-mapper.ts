import {
	LOG_LEVEL_NAMES,
	type LogEntry,
	type LogEntryApiType,
} from "./log-entry";

/**
 * Transforms raw API log entries into UI-ready domain entries:
 *  - Reassembles multi-chunk entries (total_chunks > 1) into single entries.
 *  - Adds a pre-formatted `originalEntry` string for copy/download.
 */
export function logsFromApiToDomain(entries: LogEntryApiType[]): LogEntry[] {
	const unchunked = unchunk(entries);
	return unchunked.map(buildLogEntry);
}

function unchunk(entries: LogEntryApiType[]): LogEntryApiType[] {
	const groups = new Map<string, LogEntryApiType[]>();
	const order: string[] = [];

	for (const entry of entries) {
		const key = groupKey(entry);
		const existing = groups.get(key);
		if (existing) {
			existing.push(entry);
		} else {
			groups.set(key, [entry]);
			order.push(key);
		}
	}

	const result: LogEntryApiType[] = [];
	for (const key of order) {
		const chunks = groups.get(key)!;
		if (chunks.length === 1) {
			result.push(chunks[0]);
			continue;
		}
		const sorted = [...chunks].sort(
			(a, b) => (a.chunk_index ?? 0) - (b.chunk_index ?? 0)
		);
		const merged: LogEntryApiType = {
			...sorted[0],
			message: sorted.map((c) => c.message).join(""),
			chunk_index: 0,
			total_chunks: 1,
		};
		result.push(merged);
	}

	return result;
}

function groupKey(entry: LogEntryApiType): string {
	if ((entry.total_chunks ?? 1) <= 1) {
		// Non-chunked entries should never collide — use a unique key.
		return `solo:${entry.id ?? Math.random()}`;
	}
	if (entry.id) return `id:${entry.id}`;
	return [
		"composite",
		entry.timestamp ?? "",
		entry.level ?? "",
		entry.module ?? "",
		entry.filename ?? "",
		entry.lineno ?? "",
	].join("|");
}

function buildLogEntry(entry: LogEntryApiType): LogEntry {
	const levelLabel =
		entry.level != null ? LOG_LEVEL_NAMES[entry.level] : undefined;
	const prefixParts: string[] = [];
	if (levelLabel) prefixParts.push(`[${levelLabel}]`);
	if (entry.timestamp) prefixParts.push(entry.timestamp);
	const prefix = prefixParts.join(" ");
	const originalEntry = prefix ? `${prefix} ${entry.message}` : entry.message;
	return { ...entry, originalEntry };
}
