import {
	isCompactionKey,
	memoryScopeIdentityKey,
	SCOPE_TYPE_SORT_ORDER,
	type MemoryEntry,
	type MemoryScopeInfo,
} from "../domain/memory";

export function deriveScopesFromEntries(
	entries: MemoryEntry[],
	flowName: string
): MemoryScopeInfo[] {
	const scopeMap = new Map<string, MemoryScopeInfo>();

	for (const entry of entries) {
		const scopeKey = memoryScopeIdentityKey(entry);
		const existing = scopeMap.get(scopeKey);
		if (existing) {
			existing.entryCount++;
		} else {
			scopeMap.set(scopeKey, {
				scope: entry.scope,
				scopeType: entry.scopeType,
				entryCount: 1,
			});
		}
	}

	const scopes = Array.from(scopeMap.values());

	if (
		!scopeMap.has(
			memoryScopeIdentityKey({ scope: flowName, scopeType: "flow" })
		)
	) {
		scopes.push({ scope: flowName, scopeType: "flow", entryCount: 0 });
	}

	return scopes.sort((a, b) => {
		const typeOrder =
			SCOPE_TYPE_SORT_ORDER[a.scopeType] - SCOPE_TYPE_SORT_ORDER[b.scopeType];
		if (typeOrder !== 0) return typeOrder;
		return a.scope.localeCompare(b.scope);
	});
}

/**
 * Deduplicate memory entries: keep the newest non-deleted version per key,
 * suppress keys whose newest version is a tombstone, and exclude compaction keys.
 *
 * Input MUST be sorted newest-first (by version_number descending).
 */
export function dedupeMemoryEntries(entries: MemoryEntry[]): MemoryEntry[] {
	const seen = new Set<string>();
	const result: MemoryEntry[] = [];

	for (const entry of entries) {
		if (isCompactionKey(entry.key)) continue;

		if (seen.has(entry.key)) continue;
		seen.add(entry.key);

		if (entry.isDeleted) continue;
		result.push(entry);
	}

	return result;
}

/**
 * Build a point-in-time snapshot of memory entries at the given cutoff.
 *
 * For each key, selects the newest version created at or before `cutoff`.
 * Tombstones and compaction keys are handled identically to
 * `dedupeMemoryEntries`.
 */
export function snapshotMemoryEntriesAtTime(
	sameScopeEntries: MemoryEntry[],
	cutoff: Date
): MemoryEntry[] {
	const best = new Map<string, MemoryEntry>();

	for (const entry of sameScopeEntries) {
		if (isCompactionKey(entry.key)) continue;
		if (entry.createdAt > cutoff) continue;

		const existing = best.get(entry.key);
		if (!existing || entry.createdAt > existing.createdAt) {
			best.set(entry.key, entry);
		}
	}

	return Array.from(best.values()).filter((e) => !e.isDeleted);
}
