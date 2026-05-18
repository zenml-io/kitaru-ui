import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type Build, buildFromApiToDomain } from "./build";

export async function fetchBuild(buildId: string): Promise<Build> {
	const response = await apiClient.GET("/api/v1/pipeline_builds/{build_id}", {
		params: {
			path: { build_id: buildId },
			query: { hydrate: true },
		},
	});
	return buildFromApiToDomain(expectData(response));
}
