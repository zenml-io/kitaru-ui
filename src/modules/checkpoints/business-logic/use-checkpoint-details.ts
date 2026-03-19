import { useSuspenseQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";

export function useCheckpointDetails(checkpointId: string) {
	const query = useSuspenseQuery(checkpointsQueries.details(checkpointId));

	return { ...query, detailsData: query.data };
}
