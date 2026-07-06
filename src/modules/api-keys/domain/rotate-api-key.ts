import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";

import { apiKeyFromApiToDomain } from "./api-key";

export type RotateApiKeyPayload = {
	serviceAccountId: string;
	apiKeyId: string;
	retainPeriodMinutes?: number;
};

export async function rotateApiKeyRequest(
	payload: RotateApiKeyPayload,
	{ kitaruApiClient }: KitaruApiClientContext
) {
	const response = await kitaruApiClient.PUT(
		"/api/v1/service_accounts/{service_account_id}/api_keys/{api_key_name_or_id}/rotate",
		{
			params: {
				path: {
					service_account_id: payload.serviceAccountId,
					api_key_name_or_id: payload.apiKeyId,
				},
			},
			body: {
				retain_period_minutes: payload.retainPeriodMinutes ?? 0,
			},
		}
	);
	return apiKeyFromApiToDomain(expectData(response));
}
