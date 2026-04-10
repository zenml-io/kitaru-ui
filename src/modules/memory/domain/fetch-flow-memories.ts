import {
	MEMORY_TAG_SCOPE_PREFIX,
	MEMORY_TAG_SCOPE_TYPE_PREFIX,
	type MemoryEntry,
} from "./memory";
import { fetchMemoryEntries } from "./fetch-memory-entries";

export function fetchFlowMemories(flowName: string): Promise<MemoryEntry[]> {
	return fetchMemoryEntries({
		extraTags: [
			`${MEMORY_TAG_SCOPE_TYPE_PREFIX}flow`,
			`${MEMORY_TAG_SCOPE_PREFIX}${flowName}`,
		],
	});
}
