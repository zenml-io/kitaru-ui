import { useSuspenseQuery } from "@tanstack/react-query";
import type { ExecutionStatus } from "../domain/execution";
import { getIsActiveStatus } from "@/shared/business-logic/status";
import { executionsQueries } from "./executions-queries";

type Options = Omit<
	ReturnType<typeof executionsQueries.logs>,
	"queryKey" | "queryFn"
>;

export function getExecutionLogsPollingInterval(
	executionStatus: ExecutionStatus | undefined
) {
	return getIsActiveStatus(executionStatus) ? 3000 : false;
}

export function useExecutionLogs(
	runId: string,
	source: string,
	opts: Options = {}
) {
	const query = useSuspenseQuery({
		...executionsQueries.logs(runId, source),
		...opts,
	});
	return { ...query, logs: query.data };
}
