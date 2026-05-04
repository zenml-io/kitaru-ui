import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { components } from "@/shared/api/openapi";

export type ArtifactStore = components["schemas"]["ComponentResponse"];

export async function fetchArtifactStore(
	componentId: string
): Promise<ArtifactStore> {
	const response = await apiClient.GET("/api/v1/components/{component_id}", {
		params: {
			path: { component_id: componentId },
			query: { hydrate: true },
		},
	});
	return expectData(response);
}
