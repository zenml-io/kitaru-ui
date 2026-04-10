import {
	MEMORY_TAG_MARKER,
	MEMORY_TAG_SCOPE_TYPE_PREFIX,
	type MemoryEntry,
	type MemoryScopeType,
	buildMemoryArtifactName,
	mapArtifactVersionToMemoryEntry,
} from "./memory";
import { fetchMemoryArtifactVersions } from "./fetch-memory-artifact-versions";

export async function fetchMemoryHistory(
	scope: string,
	scopeType: MemoryScopeType,
	key: string
): Promise<MemoryEntry[]> {
	const artifactVersions = await fetchMemoryArtifactVersions({
		artifact: buildMemoryArtifactName(scopeType, scope, key),
		tags: [MEMORY_TAG_MARKER, `${MEMORY_TAG_SCOPE_TYPE_PREFIX}${scopeType}`],
		logical_operator: "and",
		sort_by: "desc:version_number",
	});

	return artifactVersions
		.map(mapArtifactVersionToMemoryEntry)
		.filter((e) => e !== null);
}
