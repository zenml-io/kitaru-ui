import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import {
	type Execution,
	executionFromApiToDomain,
	type RunConfiguration,
} from "./execution";

export type ReplayExecutionParams = {
	executionId: string;
	payload?: RunConfiguration;
};

export async function replayExecution({
	executionId,
	payload,
}: ReplayExecutionParams): Promise<Execution> {
	const response = await apiClient.POST("/api/v1/runs/{run_id}/replay", {
		body: payload,
		params: {
			path: { run_id: executionId },
		},
	});
	return executionFromApiToDomain(expectData(response));
}
