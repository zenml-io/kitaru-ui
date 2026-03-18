import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { UserUpdate } from "./users";

export async function updateCurrentUserRequest(payload: UserUpdate) {
	const response = await apiClient.PUT("/api/v1/current-user", {
		body: payload,
	});
	return expectData(response);
}
