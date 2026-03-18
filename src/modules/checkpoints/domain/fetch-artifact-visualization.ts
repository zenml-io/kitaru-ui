import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { ArtifactVisualization } from "./visualization";

export async function fetchArtifactVisualization(
	artifactVersionId: string
): Promise<ArtifactVisualization> {
	const response = await apiClient.GET(
		"/api/v1/artifact_versions/{artifact_version_id}/visualize",
		{
			params: {
				path: { artifact_version_id: artifactVersionId },
				query: { index: 0 },
			},
		}
	);
	return expectData(response);
}
