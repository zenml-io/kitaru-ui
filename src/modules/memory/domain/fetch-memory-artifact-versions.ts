import type { components } from "@/shared/api/openapi";
import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";

const DEFAULT_PAGE = 1;
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
	const allItems: components["schemas"]["ArtifactVersionResponse"][] = [];
	let page = DEFAULT_PAGE;

	while (true) {
		const response = await apiClient.GET("/api/v1/artifact_versions", {
			params: {
				query: {
					...query,
					hydrate: true,
					page,
					size: MAX_PAGE_SIZE,
				},
			},
		});

		const data = expectData(response);
		allItems.push(...data.items);

		if (page >= data.total_pages) break;
		page++;
	}

	return allItems;
}
