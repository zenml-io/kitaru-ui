import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type Flow, flowFromApiToDomain } from "./flow";

export async function fetchFlows(): Promise<Flow[]> {
	const response = await apiClient.GET("/api/v1/pipelines", {
		params: {
			query: {
				page: 1,
				size: 1000,
			},
		},
	});
	const flowsPage = expectData(response);

	return flowsPage.items.map(flowFromApiToDomain);
}
