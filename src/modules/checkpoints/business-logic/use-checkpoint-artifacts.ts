import { useQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";

export function useCheckpointArtifacts(checkpointId?: string) {
	const query = useQuery({
		...checkpointsQueries.artifacts(checkpointId ?? ""),
		enabled: !!checkpointId,
	});

	return { ...query, artifactsData: query.data ?? null };
}
