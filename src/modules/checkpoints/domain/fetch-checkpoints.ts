import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type Checkpoint, checkpointFromApiToDomain } from "./checkpoint";

// TODO: Remove these constants and use the API pagination instead
const DEFAULT_PAGE = 1;
const MAX_PAGE_SIZE = 1000;

export async function fetchCheckpoints(
	executionId: string
): Promise<Checkpoint[]> {
	const response = await apiClient.GET("/api/v1/runs/{run_id}/steps", {
		params: {
			path: { run_id: executionId },
			query: {
				page: DEFAULT_PAGE,
				size: MAX_PAGE_SIZE,
			},
		},
	});
	const checkpointsPage = expectData(response);

	return checkpointsPage.items.map(checkpointFromApiToDomain);
}
