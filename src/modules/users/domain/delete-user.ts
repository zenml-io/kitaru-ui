import { apiClient } from "@/shared/api/domain/api-client";
import { expectOptionalData } from "@/shared/api/utils/unwrap-api-result";

export async function deleteUserRequest(
	userNameOrId: string
): Promise<unknown | undefined> {
	const response = await apiClient.DELETE("/api/v1/users/{user_name_or_id}", {
		params: {
			path: {
				user_name_or_id: userNameOrId,
			},
		},
	});

	return expectOptionalData(response);
}
