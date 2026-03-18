import { useSuspenseQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";

export function useArtifactVisualization(artifactVersionId: string) {
	const query = useSuspenseQuery(
		checkpointsQueries.visualization(artifactVersionId)
	);
	return { ...query, visualizationData: query.data };
}
