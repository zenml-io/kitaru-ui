import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { RunConfiguration } from "./invoke-parameters-editor";
import { executionFromApiToDomain } from "@/modules/executions/domain/execution";

export type InvokeDeploymentArgs = {
	snapshotId: string;
	runConfiguration: RunConfiguration;
};

export async function invokeDeployment({
	snapshotId,
	runConfiguration,
}: InvokeDeploymentArgs) {
	const response = await apiClient.POST(
		"/api/v1/pipeline_snapshots/{snapshot_id}/runs",
		{
			body: {
				run_configuration: runConfiguration,
			},
			params: {
				path: { snapshot_id: snapshotId },
			},
		}
	);

	return executionFromApiToDomain(expectData(response));
}
