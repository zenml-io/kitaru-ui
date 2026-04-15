import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { type Flow, flowFromApiToDomain } from "./flow";

// TODO: Remove these constants and use the API pagination instead
const DEFAULT_PAGE = 1;
const MAX_PAGE_SIZE = 1000;

export async function fetchFlows(
	query: Record<string, unknown> = {}
): Promise<Flow[]> {
	const response = await apiClient.GET("/api/v1/pipelines", {
		params: {
			query: { page: DEFAULT_PAGE, size: MAX_PAGE_SIZE, ...query },
		},
	});
	const flowsPage = expectData(response);
	return flowsPage.items.map(flowFromApiToDomain);
}
