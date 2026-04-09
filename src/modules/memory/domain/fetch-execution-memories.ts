import {
	MEMORY_TAG_MARKER,
	MEMORY_TAG_SCOPE_TYPE_PREFIX,
	MEMORY_TAG_FLOW_ID_PREFIX,
	type MemoryEntry,
	mapArtifactVersionToMemoryEntry,
} from "./memory";
import { fetchMemoryArtifactVersions } from "./fetch-memory-artifact-versions";

export async function fetchExecutionMemories(
	flowId: string
): Promise<MemoryEntry[]> {
	const versions = await fetchMemoryArtifactVersions({
		tags: [
			MEMORY_TAG_MARKER,
			`${MEMORY_TAG_SCOPE_TYPE_PREFIX}execution`,
			`${MEMORY_TAG_FLOW_ID_PREFIX}${flowId}`,
		],
		logical_operator: "and",
		sort_by: "desc:version_number",
	});

	return versions
		.map(mapArtifactVersionToMemoryEntry)
		.filter((e) => e !== null);
}
