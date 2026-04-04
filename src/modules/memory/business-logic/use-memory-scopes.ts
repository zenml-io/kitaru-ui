import { useSuspenseQuery } from "@tanstack/react-query";
import { memoryQueries } from "./memory-queries";

export function useMemoryScopes() {
	const query = useSuspenseQuery(memoryQueries.scopes());
	return { ...query, memoryScopesData: query.data };
}
