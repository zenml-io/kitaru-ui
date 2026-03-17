import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { userFromApiToDomain, type User } from "./users";

export async function fetchCurrentUser(): Promise<User> {
	const response = await apiClient.GET("/api/v1/current-user");
	return userFromApiToDomain(expectData(response));
}
