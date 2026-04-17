import type { components } from "@/shared/api/openapi";
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

/**
 * Maps ZenML source names to Kitaru domain vocabulary. Unknown sources pass
 * through unchanged so the UI stays resilient to new backend values.
 */
const SOURCE_API_TO_DOMAIN: Record<string, string> = {
	step: "checkpoint",
	prepare_step: "prepare_checkpoint",
};

const SOURCE_DOMAIN_TO_API: Record<string, string> = Object.fromEntries(
	Object.entries(SOURCE_API_TO_DOMAIN).map(([k, v]) => [v, k])
);

export function logSourceFromApiToDomain(source: string): string {
	return SOURCE_API_TO_DOMAIN[source] ?? source;
}

export function logSourceFromDomainToApi(source: string): string {
	return SOURCE_DOMAIN_TO_API[source] ?? source;
}

/**
 * Extracts the set of log source names from a checkpoint's `log_collection`.
 * Entries with a missing/empty source are dropped. Returns domain names.
 */
export function extractLogSources(
	collection: components["schemas"]["LogsResponse"][] | null | undefined
): string[] {
	if (!collection) return [];
	return collection
		.map((l) => l.body?.source)
		.filter((s): s is string => typeof s === "string" && s.length > 0)
		.map(logSourceFromApiToDomain);
}

type Placeholder = { index: number };

function unchunk(entries: LogEntryApiType[]): LogEntryApiType[] {
	// Solo entries pass through directly (no grouping needed) — their position
	// in the output is reserved via a placeholder so we can splice the merged
	// chunk result back in order afterwards.
	const result: (LogEntryApiType | Placeholder)[] = [];
	const groups = new Map<string, LogEntryApiType[]>();
	const groupOrder = new Map<string, number>();

	for (const entry of entries) {
		if ((entry.total_chunks ?? 1) <= 1) {
			result.push(entry);
			continue;
		}
		const key = chunkGroupKey(entry);
		const existing = groups.get(key);
		if (existing) {
			existing.push(entry);
		} else {
			groups.set(key, [entry]);
			groupOrder.set(key, result.length);
			result.push({ index: result.length });
		}
	}

	for (const [key, chunks] of groups) {
		const position = groupOrder.get(key)!;
		const sorted = [...chunks].sort(
			(a, b) => (a.chunk_index ?? 0) - (b.chunk_index ?? 0)
		);
		const expected = sorted[0].total_chunks ?? sorted.length;
		if (sorted.length !== expected) {
			console.warn("Incomplete log chunk group — merging partial message", {
				key,
				expected,
				got: sorted.length,
			});
		}
		result[position] = {
			...sorted[0],
			message: sorted.map((c) => c.message).join(""),
			chunk_index: 0,
			total_chunks: 1,
		};
	}

	return result as LogEntryApiType[];
}

function chunkGroupKey(entry: LogEntryApiType): string {
	if (entry.id) return `id:${entry.id}`;
	// Fallback — backend omitted id on a multi-chunk entry. Composite key may
	// accidentally merge two unrelated chunks that share every dimension, so
	// warn when we hit this path.
	console.warn(
		"Chunked log entry missing id — falling back to composite group key",
		entry
	);
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
