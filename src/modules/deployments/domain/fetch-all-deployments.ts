import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type Deployment, deploymentFromApiToDomain } from "./deployment";

const DEFAULT_PAGE = 1;
const MAX_PAGE_SIZE = 1000;

export async function fetchAllDeployments(): Promise<Deployment[]> {
	const response = await apiClient.GET("/api/v1/pipeline_snapshots", {
		params: {
			query: {
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
