import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { components } from "@/shared/api/openapi";

export type ServerInfo = components["schemas"]["ServerModel"];

export async function fetchServerInfo(): Promise<ServerInfo> {
	const response = await apiClient.GET("/api/v1/info");
	return expectData(response);
}
