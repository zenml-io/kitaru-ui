import { useSuspenseQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";

export function useCheckpoints(executionId: string) {
	const query = useSuspenseQuery(checkpointsQueries.all(executionId));

	return { ...query, checkpointsData: query.data };
}
