import { useQuery } from "@tanstack/react-query";
import { memoryQueries } from "./memory-queries";

export function useMemories(scope: string) {
	const query = useQuery(memoryQueries.entries(scope));
	return { ...query, memoryEntriesData: query.data ?? [] };
}
