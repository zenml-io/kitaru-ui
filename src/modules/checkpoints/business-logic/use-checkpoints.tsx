import { useSuspenseQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";
import { getIsActiveStatus } from "@/shared/business-logic/status";
import type { DagResponse } from "../domain/checkpoint";

export function getCheckpointsPollingInterval(query: {
	state: { data?: DagResponse };
}) {
	return getIsActiveStatus(query.state.data?.executionStatus) ? 3000 : false;
}

type Options = Omit<
	ReturnType<typeof checkpointsQueries.all>,
	"queryKey" | "queryFn"
>;

export function useCheckpoints(executionId: string, opts: Options = {}) {
	const query = useSuspenseQuery({
		...checkpointsQueries.all(executionId),
		...opts,
	});

	return { ...query, checkpointsData: query.data };
}
