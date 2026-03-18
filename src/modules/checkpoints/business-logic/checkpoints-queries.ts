import { queryOptions } from "@tanstack/react-query";
import { fetchCheckpoints } from "../domain/fetch-checkpoints";
import { fetchCheckpointArtifacts } from "../domain/checkpoint-artifacts";
import { fetchArtifactVisualization } from "../domain/fetch-artifact-visualization";

export const checkpointsQueryKeys = {
	all: (executionId: string) => ["checkpoints", executionId] as const,
	artifacts: (checkpointId: string) =>
		["checkpoints", "artifacts", checkpointId] as const,
	visualization: (artifactVersionId: string) =>
		["checkpoints", "visualization", artifactVersionId] as const,
};

export const checkpointsQueries = {
	all: (executionId: string) =>
		queryOptions({
			queryKey: checkpointsQueryKeys.all(executionId),
			queryFn: () => fetchCheckpoints(executionId),
		}),
	artifacts: (checkpointId: string) =>
		queryOptions({
			queryKey: checkpointsQueryKeys.artifacts(checkpointId),
			queryFn: () => fetchCheckpointArtifacts(checkpointId),
		}),
	visualization: (artifactVersionId: string) =>
		queryOptions({
			queryKey: checkpointsQueryKeys.visualization(artifactVersionId),
			queryFn: () => fetchArtifactVisualization(artifactVersionId),
		}),
};
