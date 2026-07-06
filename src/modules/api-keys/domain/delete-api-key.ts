import { expectOptionalData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";

export type DeleteApiKeyPayload = {
	serviceAccountId: string;
	apiKeyId: string;
};

export async function deleteApiKeyRequest(
	payload: DeleteApiKeyPayload,
	{ kitaruApiClient }: KitaruApiClientContext
): Promise<void> {
	const response = await kitaruApiClient.DELETE(
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
