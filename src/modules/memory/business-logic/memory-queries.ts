import { queryOptions } from "@tanstack/react-query";
import { fetchMemoryScopes } from "../domain/fetch-memory-scopes";
import { fetchMemories } from "../domain/fetch-memories";
import { fetchMemoryHistory } from "../domain/fetch-memory-history";

export const memoryQueryKeys = {
	base: ["memory"] as const,
	scopes: () => [...memoryQueryKeys.base, "scopes"] as const,
	entries: (scope: string) =>
		[...memoryQueryKeys.base, "entries", scope] as const,
	history: (scope: string, key: string) =>
		[...memoryQueryKeys.base, "history", scope, key] as const,
};

const MEMORY_STALE_TIME = 30_000;

export const memoryQueries = {
	scopes: () =>
		queryOptions({
			queryKey: memoryQueryKeys.scopes(),
			queryFn: fetchMemoryScopes,
			staleTime: MEMORY_STALE_TIME,
		}),
	entries: (scope: string) =>
		queryOptions({
			queryKey: memoryQueryKeys.entries(scope),
			queryFn: () => fetchMemories(scope),
			staleTime: MEMORY_STALE_TIME,
		}),
	history: (scope: string, key: string) =>
		queryOptions({
			queryKey: memoryQueryKeys.history(scope, key),
			queryFn: () => fetchMemoryHistory(scope, key),
			staleTime: MEMORY_STALE_TIME,
		}),
};
