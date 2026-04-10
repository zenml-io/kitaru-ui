import {
	MEMORY_TAG_MARKER,
	MEMORY_TAG_SCOPE_TYPE_PREFIX,
	type MemoryEntry,
	type MemoryScopeIdentity,
	buildMemoryArtifactName,
	mapArtifactVersionToMemoryEntry,
} from "./memory";
import { fetchMemoryArtifactVersions } from "./fetch-memory-artifact-versions";

export async function fetchMemoryHistory(
	scope: MemoryScopeIdentity,
	key: string
): Promise<MemoryEntry[]> {
	const artifactVersions = await fetchMemoryArtifactVersions({
		artifact: buildMemoryArtifactName(scope, key),
		tags: [
			MEMORY_TAG_MARKER,
			`${MEMORY_TAG_SCOPE_TYPE_PREFIX}${scope.scopeType}`,
		],
		logical_operator: "and",
		sort_by: "desc:version_number",
	});

	return artifactVersions
		.map(mapArtifactVersionToMemoryEntry)
		.filter((e) => e !== null);
}
