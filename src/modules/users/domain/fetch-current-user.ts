import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";
import { userFromApiToDomain, type KitaruUser } from "./users";

export async function fetchCurrentUser({
	kitaruApiClient,
}: KitaruApiClientContext): Promise<KitaruUser> {
	const response = await kitaruApiClient.GET("/api/v1/current-user");
	return userFromApiToDomain(expectData(response));
}
