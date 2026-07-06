import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";

import { apiKeyFromApiToDomain } from "./api-key";

export type FetchApiKeyListParams = {
	serviceAccountId: string;
};

export async function fetchApiKeyList(
	{ serviceAccountId }: FetchApiKeyListParams,
	{ kitaruApiClient }: KitaruApiClientContext
) {
	const response = await kitaruApiClient.GET(
		"/api/v1/service_accounts/{service_account_id}/api_keys",
		{
			params: {
				path: { service_account_id: serviceAccountId },
				query: {
					sort_by: "desc:created",
					hydrate: true,
					page: 1,
					size: 1000,
				},
			},
		}
	);
	const data = expectData(response);
	return {
		...data,
		items: data.items.map(apiKeyFromApiToDomain),
	};
}
