import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { secretFromApiToDomain } from "./secrets";

export async function fetchSecretList() {
	const response = await apiClient.GET("/api/v1/secrets", {
		params: {
			query: {
				sort_by: "desc:created",
				hydrate: true,
				page: 1,
				size: 1000,
			},
		},
	});
	const data = expectData(response);
	return {
		...data,
		items: data.items.map(secretFromApiToDomain),
	};
}
