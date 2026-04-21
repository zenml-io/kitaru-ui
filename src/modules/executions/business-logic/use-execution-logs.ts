import { useQuery } from "@tanstack/react-query";
import { getIsActiveStatus } from "@/shared/business-logic/status";
import type { ExecutionStatus } from "../domain/execution";
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
	executionId: string,
	source: string,
	opts: Options = {}
) {
	return useQuery({
		...executionsQueries.logs(executionId, source),
		...opts,
	});
}
