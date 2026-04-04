import {
	MEMORY_TAG_MARKER,
	type MemoryScopeInfo,
	type MemoryScopeType,
	mapArtifactVersionToMemoryEntry,
	dedupeMemoryEntries,
} from "./memory";
import { fetchMemoryArtifactVersions } from "./fetch-memory-artifact-versions";

const SCOPE_TYPE_ORDER: Record<MemoryScopeType, number> = {
	flow: 0,
	namespace: 1,
	execution: 2,
	unknown: 3,
};

export async function fetchMemoryScopes(): Promise<MemoryScopeInfo[]> {
	const artifactVersions = await fetchMemoryArtifactVersions({
		tags: [MEMORY_TAG_MARKER],
		sort_by: "desc:version_number",
	});

	const entries = artifactVersions
		.map(mapArtifactVersionToMemoryEntry)
		.filter((e) => e !== null);

	const deduped = dedupeMemoryEntries(entries);

	const scopeMap = new Map<
		string,
		{ scopeType: MemoryScopeType; entryCount: number }
	>();

	for (const entry of deduped) {
		const existing = scopeMap.get(entry.scope);
		if (existing) {
			existing.entryCount++;
			if (existing.scopeType === "unknown" && entry.scopeType !== "unknown") {
				existing.scopeType = entry.scopeType;
			}
		} else {
			scopeMap.set(entry.scope, {
				scopeType: entry.scopeType,
				entryCount: 1,
			});
		}
	}

	return Array.from(scopeMap.entries())
		.map(([scope, info]) => ({
			scope,
			scopeType: info.scopeType,
			entryCount: info.entryCount,
		}))
		.sort((a, b) => {
			const typeOrder =
				SCOPE_TYPE_ORDER[a.scopeType] - SCOPE_TYPE_ORDER[b.scopeType];
			if (typeOrder !== 0) return typeOrder;
			return a.scope.localeCompare(b.scope);
		});
}
