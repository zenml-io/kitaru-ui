import { apiClient } from "@/shared/api/domain/api-client";
import { apiPaths } from "@/shared/api/domain/api-paths";
import type { components } from "@/shared/api/openapi";

export type ServerInfo = components["schemas"]["ServerModel"];

export async function fetchServerInfo(): Promise<ServerInfo> {
	const response = await apiClient(apiPaths.info, { method: "GET" });
	return response.json();
}
