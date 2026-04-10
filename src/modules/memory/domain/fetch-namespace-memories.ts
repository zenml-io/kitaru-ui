import { MEMORY_TAG_SCOPE_TYPE_PREFIX, type MemoryEntry } from "./memory";
import { fetchMemoryEntries } from "./fetch-memory-entries";

export function fetchNamespaceMemories(): Promise<MemoryEntry[]> {
	return fetchMemoryEntries({
		extraTags: [`${MEMORY_TAG_SCOPE_TYPE_PREFIX}namespace`],
	});
}
