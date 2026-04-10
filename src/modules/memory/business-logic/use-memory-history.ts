import { skipToken, useQuery } from "@tanstack/react-query";
import { memoryQueries } from "./memory-queries";
import type { MemoryScopeIdentity } from "../domain/memory";

const DISABLED_SCOPE: MemoryScopeIdentity = {
	scope: "",
	scopeType: "unknown",
};

export function useMemoryHistory(
	scope: MemoryScopeIdentity | undefined,
	key?: string
) {
	const options = memoryQueries.history(scope ?? DISABLED_SCOPE, key ?? "");
	const query = useQuery({
		...options,
		queryFn: scope && key ? options.queryFn : skipToken,
	});
	return { ...query, memoryHistoryData: query.data };
}
