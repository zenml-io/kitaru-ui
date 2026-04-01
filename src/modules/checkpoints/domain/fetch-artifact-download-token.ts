import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";

export async function fetchArtifactDownloadToken(
	artifactVersionId: string
): Promise<string> {
	const response = await apiClient.GET(
		"/api/v1/artifact_versions/{artifact_version_id}/download-token",
		{
			params: {
				path: { artifact_version_id: artifactVersionId },
			},
		}
	);
	return expectData(response);
}
