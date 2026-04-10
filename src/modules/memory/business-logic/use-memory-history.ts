import { useQuery } from "@tanstack/react-query";
import { memoryQueries } from "./memory-queries";
import type { MemoryScopeIdentity } from "../domain/memory";

export function useMemoryHistory(
	scope: MemoryScopeIdentity | undefined,
	key?: string
) {
	const query = useQuery({
		...memoryQueries.history(
			scope ?? { scope: "", scopeType: "unknown" },
			key ?? ""
		),
		enabled: !!scope && !!key,
	});
	return { ...query, memoryHistoryData: query.data };
}
