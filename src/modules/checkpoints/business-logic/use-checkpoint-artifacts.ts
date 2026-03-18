import { useSuspenseQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";

export function useCheckpointArtifacts(checkpointId: string) {
	const query = useSuspenseQuery(checkpointsQueries.artifacts(checkpointId));

	return { ...query, artifactsData: query.data };
}
