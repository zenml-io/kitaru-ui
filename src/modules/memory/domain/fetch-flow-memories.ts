import {
	MEMORY_TAG_MARKER,
	MEMORY_TAG_SCOPE_TYPE_PREFIX,
	type MemoryEntry,
	mapArtifactVersionToMemoryEntry,
	dedupeMemoryEntries,
} from "./memory";
import { fetchMemoryArtifactVersions } from "./fetch-memory-artifact-versions";

export async function fetchFlowMemories(
	flowName: string
): Promise<MemoryEntry[]> {
	const versions = await fetchMemoryArtifactVersions({
		tags: [MEMORY_TAG_MARKER, `${MEMORY_TAG_SCOPE_TYPE_PREFIX}flow`],
		artifact: `startswith:kitaru_mem:${flowName}:`,
		logical_operator: "and",
		sort_by: "desc:version_number",
	});

	const entries = versions
		.map(mapArtifactVersionToMemoryEntry)
		.filter((e) => e !== null);

	return dedupeMemoryEntries(entries);
}
