import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";

import { apiKeyFromApiToDomain } from "./api-key";

export type CreateApiKeyPayload = {
	serviceAccountId: string;
	name: string;
	description?: string;
};

export async function createApiKeyRequest(
	payload: CreateApiKeyPayload,
	{ kitaruApiClient }: KitaruApiClientContext
) {
	const response = await kitaruApiClient.POST(
		"/api/v1/service_accounts/{service_account_id}/api_keys",
		{
			params: {
				path: { service_account_id: payload.serviceAccountId },
			},
			body: {
				name: payload.name,
				description: payload.description,
			},
		}
	);
	return apiKeyFromApiToDomain(expectData(response));
}
