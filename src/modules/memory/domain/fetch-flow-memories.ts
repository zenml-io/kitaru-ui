import {
	MEMORY_TAG_MARKER,
	MEMORY_TAG_SCOPE_TYPE_PREFIX,
	type MemoryEntry,
	mapArtifactVersionToMemoryEntry,
} from "./memory";
import { fetchMemoryArtifactVersions } from "./fetch-memory-artifact-versions";

export async function fetchFlowMemories(
	flowName: string
): Promise<MemoryEntry[]> {
	const versions = await fetchMemoryArtifactVersions({
		tags: [MEMORY_TAG_MARKER, `${MEMORY_TAG_SCOPE_TYPE_PREFIX}flow`],
		artifact: `startswith:kitaru_mem:flow:${flowName}:`,
		logical_operator: "and",
		sort_by: "desc:version_number",
	});

	return versions
		.map(mapArtifactVersionToMemoryEntry)
		.filter((e) => e !== null);
}
