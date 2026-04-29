import { queryOptions } from "@tanstack/react-query";
import { fetchArtifactStore } from "../domain/fetch-artifact-store";

export const artifactStoresQueryKeys = {
	detail: (componentId: string) =>
		["artifact-stores", "detail", componentId] as const,
};

export const artifactStoresQueries = {
	detail: (componentId: string) =>
		queryOptions({
			queryKey: artifactStoresQueryKeys.detail(componentId),
			queryFn: () => fetchArtifactStore(componentId),
		}),
};
