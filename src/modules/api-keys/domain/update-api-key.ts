import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";

import { apiKeyFromApiToDomain } from "./api-key";

export type UpdateApiKeyPayload = {
	serviceAccountId: string;
	apiKeyId: string;
	name?: string;
	description?: string | null;
	active?: boolean;
};

export async function updateApiKeyRequest(payload: UpdateApiKeyPayload) {
	const body: {
		name?: string | null;
		description?: string | null;
		active?: boolean | null;
	} = {};
	if (payload.name !== undefined) body.name = payload.name;
	if (payload.description !== undefined) body.description = payload.description;
	if (payload.active !== undefined) body.active = payload.active;

	const response = await apiClient.PUT(
		"/api/v1/service_accounts/{service_account_id}/api_keys/{api_key_name_or_id}",
		{
			params: {
				path: {
					service_account_id: payload.serviceAccountId,
					api_key_name_or_id: payload.apiKeyId,
				},
			},
			body,
		}
	);
	return apiKeyFromApiToDomain(expectData(response));
}
