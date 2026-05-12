import { queryOptions } from "@tanstack/react-query";
import { fetchCheckpointEntries } from "../domain/fetch-checkpoint-entries";
import { fetchArtifactVisualization } from "../domain/fetch-artifact-visualization";
import { fetchCheckpointDetails } from "../domain/fetch-checkpoint";
import { fetchArtifactVersion } from "../domain/fetch-artifact-version";
import { fetchCheckpointLogs } from "../domain/fetch-checkpoint-logs";

export const checkpointsQueryKeys = {
	all: (executionId: string) => ["checkpoints", executionId] as const,
	details: (checkpointId: string) =>
		["checkpoints", "details", checkpointId] as const,
	artifactVisualization: (artifactVersionId: string) =>
		["checkpoints", "artifactVisualization", artifactVersionId] as const,
	artifactVersion: (artifactVersionId: string) =>
		["checkpoints", "artifactVersion", artifactVersionId] as const,
	logs: (checkpointId: string, source?: string) =>
		["checkpoints", "logs", checkpointId, source ?? null] as const,
};

export const checkpointsQueries = {
	all: (executionId: string) =>
		queryOptions({
			queryKey: checkpointsQueryKeys.all(executionId),
			queryFn: () => fetchCheckpointEntries(executionId),
		}),
	details: (checkpointId: string) =>
		queryOptions({
			queryKey: checkpointsQueryKeys.details(checkpointId),
			queryFn: () => fetchCheckpointDetails(checkpointId),
		}),
	artifactVisualization: (artifactVersionId: string) =>
		queryOptions({
			queryKey: checkpointsQueryKeys.artifactVisualization(artifactVersionId),
			queryFn: () => fetchArtifactVisualization(artifactVersionId),
		}),
	artifactVersion: (artifactVersionId: string) =>
		queryOptions({
			queryKey: checkpointsQueryKeys.artifactVersion(artifactVersionId),
			queryFn: () => fetchArtifactVersion(artifactVersionId),
		}),
	logs: (checkpointId: string, source?: string) =>
		queryOptions({
			queryKey: checkpointsQueryKeys.logs(checkpointId, source),
			queryFn: () => fetchCheckpointLogs(checkpointId, source),
		}),
};
