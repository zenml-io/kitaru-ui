import { clearCsrfToken } from "@/shared/api/utils/csrf-token-cookie";
import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";

export async function logoutUser({ kitaruApiClient }: KitaruApiClientContext) {
	const response = await kitaruApiClient.GET("/api/v1/logout", {});
	const data = expectData(response);
	clearCsrfToken();
	return data;
}
