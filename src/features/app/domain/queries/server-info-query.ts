import { apiClient } from "@/shared/api/domain/api-client";
import { apiPaths } from "@/shared/api/domain/api-paths";
import type { components } from "@/shared/api/types";
import { queryOptions } from "@tanstack/react-query";

export type ServerInfo = components["schemas"]["ServerModel"];

export const SERVER_INFO_QUERY_KEY = ["server-info"] as const;

export async function fetchServerInfo(): Promise<ServerInfo> {
	const response = await apiClient(apiPaths.info, { method: "GET" });
	return response.json();
}

export function serverInfoQueryOptions() {
	return queryOptions({
		queryKey: SERVER_INFO_QUERY_KEY,
		queryFn: fetchServerInfo,
	});
}
