import type { components } from "@/shared/api/openapi";
import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";

const MAX_PAGE_SIZE = 1000;

type MemoryArtifactVersionQuery = {
	tags?: string[];
	artifact?: string;
	sort_by?: string;
	logical_operator?: components["schemas"]["LogicalOperators"];
};

export async function fetchMemoryArtifactVersions(
	query: MemoryArtifactVersionQuery
): Promise<components["schemas"]["ArtifactVersionResponse"][]> {
	const response = await apiClient.GET("/api/v1/artifact_versions", {
		params: {
			query: {
				...query,
				hydrate: true,
				size: MAX_PAGE_SIZE,
			},
		},
	});

	return expectData(response).items;
}
