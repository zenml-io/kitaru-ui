import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type Deployment, deploymentFromApiToDomain } from "./deployment";

function snapshotName(flowName: string, version: number): string {
	return `kitaru::${flowName}::v${version}`;
}

export async function fetchDeploymentByVersion(
	flowId: string,
	flowName: string,
	version: number
): Promise<Deployment | undefined> {
	const response = await apiClient.GET("/api/v1/pipeline_snapshots", {
		params: {
			query: {
				pipeline: flowId,
				name: snapshotName(flowName, version),
				page: 1,
				size: 1,
				hydrate: true,
			},
		},
	});
	const page = expectData(response);
	const first = page.items[0];
	if (!first) return undefined;
	return deploymentFromApiToDomain(first) ?? undefined;
}
