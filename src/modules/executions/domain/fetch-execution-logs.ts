import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { LogEntry } from "@/modules/logs/domain/log-entry";
import {
	logSourceFromDomainToApi,
	logsFromApiToDomain,
} from "@/modules/logs/domain/log-mapper";

export async function fetchExecutionLogs(
	runId: string,
	source: string
): Promise<LogEntry[]> {
	const apiSource = logSourceFromDomainToApi(source);
	const response = await apiClient.GET("/api/v1/runs/{run_id}/logs", {
		params: {
			path: { run_id: runId },
			query: { source: apiSource },
		},
	});
	return logsFromApiToDomain(expectData(response));
}
