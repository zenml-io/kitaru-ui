import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";
import type { components } from "@zenml/shared-kitaru/api/openapi";

export type ServerInfo = components["schemas"]["ServerModel"];

export type FetchServerInfoArgs = object;

export async function fetchServerInfo({
	kitaruApiClient,
}: KitaruApiClientContext): Promise<ServerInfo> {
	const response = await kitaruApiClient.GET("/api/v1/info");
	return expectData(response);
}
