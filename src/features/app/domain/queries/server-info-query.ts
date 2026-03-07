import { apiClient } from "@/shared/api/domain/api-client";
import { apiPaths } from "@/shared/api/domain/api-paths";
import type { components } from "@/shared/api/types";
import { queryOptions } from "@tanstack/react-query";

export type ServerInfo = components["schemas"]["ServerModel"];

export function getServerInfoQueryKey() {
	return ["server-info"] as const;
}

export async function fetchServerInfo(): Promise<ServerInfo> {
	const response = await apiClient(apiPaths.info, { method: "GET" });
	return response.json();
}

export function serverInfoQueryOptions() {
	return queryOptions({
		queryKey: getServerInfoQueryKey(),
		queryFn: fetchServerInfo,
	});
}
