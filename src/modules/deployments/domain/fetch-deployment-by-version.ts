import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { buildSnapshotName } from "../util/snapshot-name";
import { type Deployment, deploymentFromApiToDomain } from "./deployment";

export async function fetchDeploymentByVersion(
	flowId: string,
	flowName: string,
	version: number
): Promise<Deployment | undefined> {
	const response = await apiClient.GET("/api/v1/pipeline_snapshots", {
		params: {
			query: {
				pipeline: flowId,
				name: buildSnapshotName(flowName, version),
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
