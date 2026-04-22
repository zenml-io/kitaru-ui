import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";

import { apiKeyFromApiToDomain } from "./api-key";

export type CreateApiKeyPayload = {
	serviceAccountId: string;
	name: string;
	description?: string;
};

export async function createApiKeyRequest(payload: CreateApiKeyPayload) {
	const response = await apiClient.POST(
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
