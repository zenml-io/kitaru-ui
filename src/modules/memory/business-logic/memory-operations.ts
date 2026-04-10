import {
	isCompactionKey,
	SCOPE_TYPE_SORT_ORDER,
	type MemoryEntry,
	type MemoryScopeInfo,
} from "../domain/memory";

export function deriveScopesFromEntries(
	namespaceEntries: MemoryEntry[],
	flowEntries: MemoryEntry[],
	executionEntries: MemoryEntry[],
	flowId: string,
	flowName: string
): MemoryScopeInfo[] {
	const scopeMap = new Map<string, MemoryScopeInfo>();

	for (const entry of [
		...namespaceEntries,
		...flowEntries,
		...executionEntries,
	]) {
		const compositeKey = entry.scope + "\0" + entry.scopeType;
		const existing = scopeMap.get(compositeKey);
		if (existing) {
			existing.entryCount++;
			if (!existing.label && entry.scopeLabel) {
				existing.label = entry.scopeLabel;
			}
		} else {
			scopeMap.set(compositeKey, {
				scope: entry.scope,
				label: entry.scopeLabel,
				scopeType: entry.scopeType,
				entryCount: 1,
			});
		}
	}

	const scopes: MemoryScopeInfo[] = Array.from(scopeMap.values());

	if (!scopes.some((s) => s.scope === flowId && s.scopeType === "flow")) {
		scopes.push({
			scope: flowId,
			label: flowName,
			scopeType: "flow",
			entryCount: 0,
		});
	}

	return scopes.sort((a, b) => {
		const typeOrder =
			SCOPE_TYPE_SORT_ORDER[a.scopeType] - SCOPE_TYPE_SORT_ORDER[b.scopeType];
		if (typeOrder !== 0) return typeOrder;
		return a.scope.localeCompare(b.scope);
	});
}

export function dedupeMemoryEntries(entries: MemoryEntry[]): MemoryEntry[] {
	const best = new Map<string, MemoryEntry>();

	for (const entry of entries) {
		if (isCompactionKey(entry.key)) continue;

		const existing = best.get(entry.key);
		if (!existing || entry.createdAt > existing.createdAt) {
			best.set(entry.key, entry);
		}
	}

	return Array.from(best.values()).filter((e) => !e.isDeleted);
}

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
