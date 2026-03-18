import { queryOptions } from "@tanstack/react-query";
import { fetchCheckpoints } from "../domain/fetch-checkpoints";
import { fetchCheckpointArtifacts } from "../domain/checkpoint-artifacts";

export const checkpointsQueryKeys = {
	all: (executionId: string) => ["checkpoints", executionId] as const,
	artifacts: (checkpointId: string) =>
		["checkpoints", "artifacts", checkpointId] as const,
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
};
