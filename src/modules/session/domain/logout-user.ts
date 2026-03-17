import { apiClient } from "@/shared/api/domain/api-client";
import { clearCsrfToken } from "@/shared/api/utils/csrf-token-cookie";
import { expectData } from "@/shared/api/utils/unwrap-api-result";

export async function logoutUser() {
	const response = await apiClient.GET("/api/v1/logout", {});
	const data = expectData(response);
	clearCsrfToken();
	return data;
}
