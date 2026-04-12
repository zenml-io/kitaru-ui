import {
	MEMORY_TAG_SCOPE_PREFIX,
	MEMORY_TAG_SCOPE_TYPE_PREFIX,
	type MemoryEntry,
} from "./memory";
import { fetchMemoryEntries } from "./fetch-memory-entries";

export function fetchSingleExecutionMemories(
	executionId: string
): Promise<MemoryEntry[]> {
	return fetchMemoryEntries({
		extraTags: [
			`${MEMORY_TAG_SCOPE_PREFIX}${executionId}`,
			`${MEMORY_TAG_SCOPE_TYPE_PREFIX}execution`,
		],
	});
}
