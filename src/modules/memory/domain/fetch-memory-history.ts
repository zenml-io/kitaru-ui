import {
	MEMORY_TAG_KEY_PREFIX,
	MEMORY_TAG_SCOPE_PREFIX,
	MEMORY_TAG_SCOPE_TYPE_PREFIX,
	type MemoryEntry,
	type MemoryScopeType,
} from "./memory";
import { fetchMemoryEntries } from "./fetch-memory-entries";

export function fetchMemoryHistory(
	scope: string,
	scopeType: MemoryScopeType,
	key: string
): Promise<MemoryEntry[]> {
	return fetchMemoryEntries({
		extraTags: [
			`${MEMORY_TAG_SCOPE_TYPE_PREFIX}${scopeType}`,
			`${MEMORY_TAG_SCOPE_PREFIX}${scope}`,
			`${MEMORY_TAG_KEY_PREFIX}${key}`,
		],
	});
}
