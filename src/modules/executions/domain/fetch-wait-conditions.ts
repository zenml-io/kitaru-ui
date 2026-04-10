import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { parseBackendTimestamp } from "@/shared/utils/time";
import type { WaitingBlock } from "./waiting-block";

export async function fetchWaitConditions(
	executionId: string
): Promise<WaitingBlock[]> {
	const response = await apiClient.GET("/api/v1/run_wait_conditions", {
		params: {
			query: {
				pipeline_run: `equals:${executionId}`,
				status: `equals:resolved`,
				sort_by: "asc:created",
				hydrate: true,
			},
		},
	});
	const page = expectData(response);

	return page.items
		.filter((item) => item.body?.status === "resolved")
		.map((item) => {
			const created = item.body?.created
				? parseBackendTimestamp(item.body.created)
				: undefined;
			const resolvedAt = item.body?.resolved_at
				? parseBackendTimestamp(item.body.resolved_at)
				: undefined;

			const waitDurationMs =
				created && resolvedAt
					? resolvedAt.getTime() - created.getTime()
					: undefined;

			const result = item.metadata?.result;
			const answer =
				typeof result === "string"
					? result
					: result != null
						? JSON.stringify(result)
						: "";

			return {
				id: item.id,
				question: item.metadata?.question ?? "",
				answer,
				dataSchema: item.metadata?.data_schema ?? undefined,
				result: item.metadata?.result ?? undefined,
				waitDurationMs:
					waitDurationMs && waitDurationMs > 0 ? waitDurationMs : undefined,
				createdAt: created,
			};
		});
}
