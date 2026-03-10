import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { components } from "@/shared/api/openapi";

export type CurrentUser = components["schemas"]["UserResponse"];

export async function fetchCurrentUser(): Promise<CurrentUser> {
	const response = await apiClient.GET("/api/v1/current-user");
	return expectData(response);
}
