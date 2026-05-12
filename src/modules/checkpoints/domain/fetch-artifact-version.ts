import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { components } from "@/shared/api/openapi";

export type ArtifactVersion = components["schemas"]["ArtifactVersionResponse"];

export async function fetchArtifactVersion(
	artifactVersionId: string
): Promise<ArtifactVersion> {
	const response = await apiClient.GET(
		"/api/v1/artifact_versions/{artifact_version_id}",
		{
			params: {
				path: { artifact_version_id: artifactVersionId },
				query: { hydrate: true },
			},
		}
	);
	return expectData(response);
}
