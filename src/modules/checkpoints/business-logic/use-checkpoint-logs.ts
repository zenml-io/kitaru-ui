import { type Query, useSuspenseQuery } from "@tanstack/react-query";
import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import { getIsActiveStatus } from "@/shared/business-logic/status";
import { checkpointsQueries } from "./checkpoints-queries";

type Options = Omit<
	ReturnType<typeof checkpointsQueries.logs>,
	"queryKey" | "queryFn"
>;

export function getCheckpointLogsPollingInterval(
	checkpointStatus: ExecutionStatus | undefined
) {
	return getIsActiveStatus(checkpointStatus) ? 3000 : false;
}

export function useCheckpointLogs(
	checkpointId: string,
	source?: string,
	opts: Options = {}
) {
	const query = useSuspenseQuery({
		...checkpointsQueries.logs(checkpointId, source),
		// Only surface errors to the boundary on the initial load. Once we
		// have logs cached, swallow poll failures so the UI keeps showing the
		// last successful snapshot instead of flashing an error state.
		throwOnError: (_err: unknown, q: Query) => q.state.data === undefined,
		...opts,
	});
	return { ...query, logs: query.data };
}
