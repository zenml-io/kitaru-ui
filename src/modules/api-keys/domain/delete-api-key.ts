import { apiClient } from "@/shared/api/domain/api-client";
import { expectOptionalData } from "@/shared/api/utils/unwrap-api-result";

export type DeleteApiKeyPayload = {
	serviceAccountId: string;
	apiKeyId: string;
};

export async function deleteApiKeyRequest(
	payload: DeleteApiKeyPayload
): Promise<void> {
	const response = await apiClient.DELETE(
		"/api/v1/service_accounts/{service_account_id}/api_keys/{api_key_name_or_id}",
		{
			params: {
				path: {
					service_account_id: payload.serviceAccountId,
					api_key_name_or_id: payload.apiKeyId,
				},
			},
		}
	);
	expectOptionalData(response);
}
