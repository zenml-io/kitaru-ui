import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { LogEntry } from "@/modules/logs/domain/log-entry";
import {
	logSourceFromDomainToApi,
	logsFromApiToDomain,
} from "@/modules/logs/domain/log-mapper";

export async function fetchCheckpointLogs(
	checkpointId: string,
	source?: string
): Promise<LogEntry[]> {
	const apiSource = source ? logSourceFromDomainToApi(source) : undefined;
	const response = await apiClient.GET("/api/v1/steps/{step_id}/logs", {
		params: {
			path: { step_id: checkpointId },
			query: apiSource ? { source: apiSource } : {},
		},
	});
	return logsFromApiToDomain(expectData(response));
}
