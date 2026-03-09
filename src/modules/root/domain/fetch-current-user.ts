import { apiClient } from "@/shared/api/domain/api-client";
import { apiPaths } from "@/shared/api/domain/api-paths";
import type { components } from "@/shared/api/openapi";

export type CurrentUser = components["schemas"]["UserResponse"];

export async function fetchCurrentUser(): Promise<CurrentUser> {
	const response = await apiClient(apiPaths.currentUser, { method: "GET" });
	return response.json();
}
