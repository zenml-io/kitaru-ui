import { queryOptions } from "@tanstack/react-query";
import { fetchCheckpoints } from "../domain/fetch-checkpoints";
import { fetchArtifactVisualization } from "../domain/fetch-artifact-visualization";
import { fetchCheckpointDetails } from "../domain/checkpoint-details";

export const checkpointsQueryKeys = {
	all: (executionId: string) => ["checkpoints", executionId] as const,
	details: (checkpointId: string) =>
		["checkpoints", "details", checkpointId] as const,
	visualization: (artifactVersionId: string) =>
		["checkpoints", "visualization", artifactVersionId] as const,
};

export const checkpointsQueries = {
	all: (executionId: string) =>
		queryOptions({
			queryKey: checkpointsQueryKeys.all(executionId),
			queryFn: () => fetchCheckpoints(executionId),
		}),
	details: (checkpointId: string) =>
		queryOptions({
			queryKey: checkpointsQueryKeys.details(checkpointId),
			queryFn: () => fetchCheckpointDetails(checkpointId),
		}),
	visualization: (artifactVersionId: string) =>
		queryOptions({
			queryKey: checkpointsQueryKeys.visualization(artifactVersionId),
			queryFn: () => fetchArtifactVisualization(artifactVersionId),
		}),
};
