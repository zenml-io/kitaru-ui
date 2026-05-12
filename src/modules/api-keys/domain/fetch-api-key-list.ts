import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";

import { apiKeyFromApiToDomain } from "./api-key";

export async function fetchApiKeyList(serviceAccountId: string) {
	const response = await apiClient.GET(
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
