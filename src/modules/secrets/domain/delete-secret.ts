import { apiClient } from "@/shared/api/domain/api-client";
import { expectOptionalData } from "@/shared/api/utils/unwrap-api-result";

export async function deleteSecretRequest(secretId: string): Promise<void> {
	const response = await apiClient.DELETE("/api/v1/secrets/{secret_id}", {
		params: {
			path: { secret_id: secretId },
		},
	});
	expectOptionalData(response);
}
