import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { userFromApiToDomain } from "./users";

export async function fetchUserList() {
	const response = await apiClient.GET("/api/v1/users", {
		params: {
			query: {
				sort_by: "desc:created",
				page: 1,
				size: 1000,
			},
		},
	});
	const data = expectData(response);
	return {
		...data,
		items: data.items.map(userFromApiToDomain),
	};
}
