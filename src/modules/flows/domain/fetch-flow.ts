import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { flowFromApiToDomain, type Flow } from "./flow";
import { apiClient } from "@/shared/api/domain/api-client";

export async function fetchFlow(flowId: string): Promise<Flow> {
	const response = await apiClient.GET("/api/v1/pipelines/{pipeline_id}", {
		params: {
			path: {
				pipeline_id: flowId,
			},
		},
	});
	return flowFromApiToDomain(expectData(response));
}
