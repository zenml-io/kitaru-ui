import { apiClient } from "@/shared/api/domain/api-client";
import { apiPaths } from "@/shared/api/domain/api-paths";
import type { components } from "@/shared/api/types";
import { queryOptions } from "@tanstack/react-query";

export type CurrentUser = components["schemas"]["UserResponse"];

export function getCurrentUserQueryKey() {
	return ["current-user"] as const;
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
	const response = await apiClient(apiPaths.currentUser, { method: "GET" });
	return response.json();
}

export function currentUserQueryOptions() {
	return queryOptions({
		queryKey: getCurrentUserQueryKey(),
		queryFn: fetchCurrentUser,
	});
}
