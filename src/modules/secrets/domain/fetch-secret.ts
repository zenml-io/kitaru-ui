import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { secretFromApiToDomain } from "./secrets";

export async function fetchSecret(secretId: string) {
	const response = await apiClient.GET("/api/v1/secrets/{secret_id}", {
		params: {
			path: { secret_id: secretId },
			query: { hydrate: true },
		},
	});
	return secretFromApiToDomain(expectData(response));
}
