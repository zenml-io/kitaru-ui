import { useSuspenseQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";

export function useCheckpoints(executionId: string) {
	const query = useSuspenseQuery({
		...checkpointsQueries.all(executionId),
		refetchInterval(query) {
			return query.state.data?.executionStatus === "running" ||
				query.state.data?.executionStatus === "initializing" ||
				query.state.data?.executionStatus === "provisioning" ||
				query.state.data?.executionStatus === "resuming"
				? 3000
				: false;
		},
	});

	return { ...query, checkpointsData: query.data };
}
