import {
	MEMORY_TAG_FLOW_ID_PREFIX,
	MEMORY_TAG_SCOPE_TYPE_PREFIX,
	type MemoryEntry,
} from "./memory";
import { fetchMemoryEntries } from "./fetch-memory-entries";

export function fetchExecutionMemories(flowId: string): Promise<MemoryEntry[]> {
	return fetchMemoryEntries({
		extraTags: [
			`${MEMORY_TAG_SCOPE_TYPE_PREFIX}execution`,
			`${MEMORY_TAG_FLOW_ID_PREFIX}${flowId}`,
		],
	});
}
