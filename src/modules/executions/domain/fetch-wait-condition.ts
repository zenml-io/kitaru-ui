import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import {
	type WaitCondition,
	waitConditionFromApiToDomain,
} from "./wait-condition";

export async function fetchWaitCondition(
	waitConditionId: string
): Promise<WaitCondition> {
	const response = await apiClient.GET(
		"/api/v1/run_wait_conditions/{run_wait_condition_id}",
		{
			params: {
				path: { run_wait_condition_id: waitConditionId },
				query: { hydrate: true },
			},
		}
	);
	return waitConditionFromApiToDomain(expectData(response));
}
