import {
	MEMORY_TAG_MARKER,
	MEMORY_TAG_SCOPE_PREFIX,
	type MemoryEntry,
	mapArtifactVersionToMemoryEntry,
	dedupeMemoryEntries,
} from "./memory";
import { fetchMemoryArtifactVersions } from "./fetch-memory-artifact-versions";

export async function fetchMemories(scope: string): Promise<MemoryEntry[]> {
	const artifactVersions = await fetchMemoryArtifactVersions({
		tags: [MEMORY_TAG_MARKER, MEMORY_TAG_SCOPE_PREFIX + scope],
		logical_operator: "and",
		sort_by: "desc:version_number",
	});

	const entries = artifactVersions
		.map(mapArtifactVersionToMemoryEntry)
		.filter((e): e is MemoryEntry => e !== null && e.scope === scope);

	return dedupeMemoryEntries(entries).sort((a, b) => {
		const timeDiff = b.createdAt.getTime() - a.createdAt.getTime();
		if (timeDiff !== 0) return timeDiff;
		return a.key.localeCompare(b.key);
	});
}
