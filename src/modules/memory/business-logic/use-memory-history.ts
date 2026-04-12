import { useQuery } from "@tanstack/react-query";
import type { MemoryScopeType } from "../domain/memory";
import { memoryQueries } from "./memory-queries";

export function useMemoryHistory(
	scope: string,
	scopeType: MemoryScopeType,
	key?: string
) {
	const query = useQuery({
		...memoryQueries.history(scope, scopeType, key ?? ""),
		enabled: !!key,
	});

	return { ...query, memoryHistoryData: query.data };
}
