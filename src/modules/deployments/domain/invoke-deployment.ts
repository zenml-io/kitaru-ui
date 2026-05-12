import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { RunConfiguration } from "./invoke-parameters-editor";
import { executionFromApiToDomain } from "@/modules/executions/domain/execution";

export type InvokeDeploymentArgs = {
	deploymentId: string;
	runConfiguration: RunConfiguration;
};

export async function invokeDeployment({
	deploymentId,
	runConfiguration,
}: InvokeDeploymentArgs) {
	const response = await apiClient.POST(
		"/api/v1/pipeline_snapshots/{snapshot_id}/runs",
		{
			body: {
				run_configuration: runConfiguration,
			},
			params: {
				path: { snapshot_id: deploymentId },
			},
		}
	);

	return executionFromApiToDomain(expectData(response));
}
