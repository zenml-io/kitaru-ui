import { queryOptions } from "@tanstack/react-query";
import { fetchCheckpoints } from "../domain/fetch-checkpoints";
import { fetchCheckpointArtifacts } from "../domain/checkpoint-artifacts";

export const checkpointsQueryKeys = {
	all: (execId: string) => ["checkpoints", execId] as const,
	artifacts: (checkpointId: string) =>
		["checkpoints", "artifacts", checkpointId] as const,
};

export const checkpointsQueries = {
	all: (execId: string) =>
		queryOptions({
			queryKey: checkpointsQueryKeys.all(execId),
			queryFn: () => fetchCheckpoints(execId),
		}),
	artifacts: (checkpointId: string) =>
		queryOptions({
			queryKey: checkpointsQueryKeys.artifacts(checkpointId),
			queryFn: () => fetchCheckpointArtifacts(checkpointId),
		}),
};
