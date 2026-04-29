import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type Deployment, deploymentFromApiToDomain } from "./deployment";

// TODO: Remove these constants and use the API pagination instead
const DEFAULT_PAGE = 1;
const MAX_PAGE_SIZE = 1000;

export async function fetchDeployments(flowId: string): Promise<Deployment[]> {
	const response = await apiClient.GET("/api/v1/pipeline_snapshots", {
		params: {
			query: {
				pipeline: flowId,
				name: "contains:kitaru::",
				page: DEFAULT_PAGE,
				size: MAX_PAGE_SIZE,
				hydrate: true,
			},
		},
	});
	const page = expectData(response);
	return page.items
		.map(deploymentFromApiToDomain)
		.filter((d): d is Deployment => d !== null);
}
