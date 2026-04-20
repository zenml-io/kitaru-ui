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
	const body: {
		name?: string;
		private?: boolean;
		values?: Record<string, string>;
	} = {};
	if (payload.name !== undefined) body.name = payload.name;
	if (payload.isPrivate !== undefined) body.private = payload.isPrivate;
	if (payload.keys !== undefined)
		body.values = keysToValuesPayload(payload.keys);

	const response = await apiClient.PUT("/api/v1/secrets/{secret_id}", {
		params: {
			path: { secret_id: secretId },
			query: { patch_values: false },
		},
		body,
	});
	return secretFromApiToDomain(expectData(response));
}
