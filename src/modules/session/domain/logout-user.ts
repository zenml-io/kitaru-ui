import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";

export async function logoutUser() {
	const response = await apiClient.GET("/api/v1/logout", {});
	return expectData(response);
}
