import { useSuspenseQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";

export function useCheckpoints(execId: string) {
	const query = useSuspenseQuery(checkpointsQueries.all(execId));

	return { ...query, checkpointsData: query.data };
}
