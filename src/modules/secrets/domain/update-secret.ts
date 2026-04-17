import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { SecretKey } from "./secrets";
import { keysToValuesPayload, secretFromApiToDomain } from "./secrets";

export type UpdateSecretPayload = {
	name?: string;
	keys?: SecretKey[];
	isPrivate?: boolean;
};

export async function updateSecretRequest(
	secretId: string,
	payload: UpdateSecretPayload
) {
	const response = await apiClient.PUT("/api/v1/secrets/{secret_id}", {
		params: {
			path: { secret_id: secretId },
			query: { patch_values: false },
		},
		body: {
			name: payload.name ?? null,
			private: payload.isPrivate ?? null,
			values: payload.keys ? keysToValuesPayload(payload.keys) : null,
		},
	});
	return secretFromApiToDomain(expectData(response));
}
