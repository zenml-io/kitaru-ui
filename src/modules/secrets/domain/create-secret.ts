import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { SecretKey } from "./secrets";
import { keysToValuesPayload, secretFromApiToDomain } from "./secrets";

export type CreateSecretPayload = {
	name: string;
	keys: SecretKey[];
	isPrivate?: boolean;
};

export async function createSecretRequest(payload: CreateSecretPayload) {
	const response = await apiClient.POST("/api/v1/secrets", {
		body: {
			name: payload.name,
			private: payload.isPrivate ?? false,
			values: keysToValuesPayload(payload.keys),
		},
	});
	return secretFromApiToDomain(expectData(response));
}
