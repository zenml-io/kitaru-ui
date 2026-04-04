import {
	MEMORY_TAG_MARKER,
	type MemoryEntry,
	buildMemoryArtifactName,
	mapArtifactVersionToMemoryEntry,
} from "./memory";
import { fetchMemoryArtifactVersions } from "./fetch-memory-artifact-versions";

export async function fetchMemoryHistory(
	scope: string,
	key: string
): Promise<MemoryEntry[]> {
	const artifactVersions = await fetchMemoryArtifactVersions({
		artifact: buildMemoryArtifactName(scope, key),
		tags: [MEMORY_TAG_MARKER],
		logical_operator: "and",
		sort_by: "desc:version_number",
	});

	return artifactVersions
		.map(mapArtifactVersionToMemoryEntry)
		.filter((e) => e !== null);
}
