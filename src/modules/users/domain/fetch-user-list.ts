import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";
import { userFromApiToDomain } from "./users";

export async function fetchUserList({
	kitaruApiClient,
}: KitaruApiClientContext) {
	const response = await kitaruApiClient.GET("/api/v1/users", {
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
