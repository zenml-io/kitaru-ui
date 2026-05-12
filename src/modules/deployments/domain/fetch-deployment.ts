import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import {
	type Deployment,
	NotAKitaruDeploymentError,
	deploymentFromApiToDomain,
} from "./deployment";

export async function fetchDeployment(snapshotId: string): Promise<Deployment> {
	const response = await apiClient.GET(
		"/api/v1/pipeline_snapshots/{snapshot_id}",
		{
			params: {
				path: { snapshot_id: snapshotId },
				query: { hydrate: true, include_config_schema: true },
			},
		}
	);
	const deployment = deploymentFromApiToDomain(expectData(response));
	if (deployment === null) throw new NotAKitaruDeploymentError(snapshotId);
	return deployment;
}
