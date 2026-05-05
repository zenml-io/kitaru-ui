import { deploymentsQueries } from "@/modules/deployments/business-logic/deployments-queries";
import { LOCAL_VERSION_ID } from "@/modules/deployments/domain/deployment";
import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import { ensureQueryDataOr404 } from "@/shared/api/utils/handle-404";
import { createFileRoute, redirect } from "@tanstack/react-router";

type ExecutionSearch = { tab?: "logs"; scope?: string };

function validateExecutionSearch(
	search: Record<string, unknown>
): ExecutionSearch {
	const out: ExecutionSearch = {};
	if (search.tab === "logs") out.tab = "logs";
	if (typeof search.scope === "string" && search.scope.length > 0) {
		out.scope = search.scope;
	}
	return out;
}

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/executions/$executionId"
)({
	validateSearch: validateExecutionSearch,
	loader: async ({ context, params, location }) => {
		const [execution, deployments] = await Promise.all([
			ensureQueryDataOr404(
				context.queryClient.ensureQueryData(
					executionsQueries.detail(params.executionId)
				)
			),
			context.queryClient.ensureQueryData(
				deploymentsQueries.list(params.flowId)
			),
		]);
		const sourceSnapshotId = execution.sourceSnapshot?.id;
		const deployment = sourceSnapshotId
			? deployments.find((d) => d.id === sourceSnapshotId)
			: undefined;

		throw redirect({
			to: "/flows/$flowId/v/$version/executions/$executionId",
			params: {
				flowId: params.flowId,
				version: deployment?.version ?? LOCAL_VERSION_ID,
				executionId: params.executionId,
			},
			search: location.search,
		});
	},
});
