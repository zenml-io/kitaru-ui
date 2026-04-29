import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";

export type InvokeDeploymentArgs = {
	snapshotId: string;
	parameters: Record<string, unknown>;
};

export type InvokeDeploymentResult = { runId: string };

export async function invokeDeployment({
	snapshotId,
	parameters,
}: InvokeDeploymentArgs): Promise<InvokeDeploymentResult> {
	const response = await apiClient.POST(
		"/api/v1/pipeline_snapshots/{snapshot_id}/runs",
		{
			body: {
				run_configuration: { parameters },
			},
			params: {
				path: { snapshot_id: snapshotId },
			},
		}
	);

	const data = expectData(response);

	const runId = data.id;

	return { runId };
}
