import { useSuspenseQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";
import { getIsActiveStatus } from "@/shared/business-logic/status";

export function useCheckpoints(executionId: string) {
	const query = useSuspenseQuery({
		...checkpointsQueries.all(executionId),
		refetchInterval(query) {
			return getIsActiveStatus(query.state.data?.executionStatus)
				? 3000
				: false;
		},
	});

	return { ...query, checkpointsData: query.data };
}
