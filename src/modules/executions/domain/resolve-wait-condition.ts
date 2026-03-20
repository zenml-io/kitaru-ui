import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { WaitConditionResolution } from "./wait-condition";

export type ResolveWaitConditionParams = {
	waitConditionId: string;
	resolution: WaitConditionResolution;
	result?: unknown;
};

export async function resolveWaitConditionRequest(
	params: ResolveWaitConditionParams
): Promise<void> {
	const response = await apiClient.PUT(
		"/api/v1/run_wait_conditions/{run_wait_condition_id}/resolve",
		{
			params: {
				path: { run_wait_condition_id: params.waitConditionId },
			},
			body: {
				resolution: params.resolution,
				result: params.result ?? null,
			},
		}
	);
	expectData(response);
}
