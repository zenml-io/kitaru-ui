import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type Step, stepFromApiToDomain } from "./step";

// TODO: Remove these constants and use the API pagination instead
const DEFAULT_PAGE = 1;
const MAX_PAGE_SIZE = 1000;

export async function fetchSteps(execId: string): Promise<Step[]> {
	const response = await apiClient.GET("/api/v1/runs/{run_id}/steps", {
		params: {
			path: { run_id: execId },
			query: {
				page: DEFAULT_PAGE,
				size: MAX_PAGE_SIZE,
			},
		},
	});
	const stepsPage = expectData(response);

	return stepsPage.items.map(stepFromApiToDomain);
}
