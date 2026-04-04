import { useQuery } from "@tanstack/react-query";
import { memoryQueries } from "./memory-queries";

export function useMemoryHistory(scope: string, key?: string) {
	const query = useQuery({
		...memoryQueries.history(scope, key ?? ""),
		enabled: !!key,
	});
	return { ...query, memoryHistoryData: query.data };
}
