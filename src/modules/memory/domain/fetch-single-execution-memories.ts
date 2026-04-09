import {
	MEMORY_TAG_MARKER,
	MEMORY_TAG_SCOPE_PREFIX,
	type MemoryEntry,
	mapArtifactVersionToMemoryEntry,
} from "./memory";
import { fetchMemoryArtifactVersions } from "./fetch-memory-artifact-versions";

export async function fetchSingleExecutionMemories(
	executionId: string
): Promise<MemoryEntry[]> {
	const versions = await fetchMemoryArtifactVersions({
		tags: [MEMORY_TAG_MARKER, `${MEMORY_TAG_SCOPE_PREFIX}${executionId}`],
		logical_operator: "and",
		sort_by: "desc:version_number",
	});

	return versions
		.map(mapArtifactVersionToMemoryEntry)
		.filter((e) => e !== null);
}
