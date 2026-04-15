import { useSuspenseQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "./checkpoints-queries";

export function useArtifactVersion(artifactVersionId: string) {
	const query = useSuspenseQuery(checkpointsQueries.version(artifactVersionId));
	return { ...query, artifactVersion: query.data };
}
