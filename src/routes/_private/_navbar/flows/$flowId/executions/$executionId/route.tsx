import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import { checkpointsQueries } from "@/modules/checkpoints/business-logic/checkpoints-queries";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { formatExecutionIndex } from "@/modules/executions/util/execution";
import { ensureQueryDataOr404 } from "@/shared/api/utils/handle-404";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/executions/$executionId"
)({
	loader: async ({ context, params }) => {
		const [, execution] = await Promise.all([
			context.queryClient.ensureQueryData(executionsQueries.all(params.flowId)),
			ensureQueryDataOr404(
				context.queryClient.ensureQueryData(
					executionsQueries.detail(params.executionId)
				)
			),
			context.queryClient.ensureQueryData(
				checkpointsQueries.all(params.executionId)
			),
		]);

		return {
			crumb: {
				label: formatExecutionIndex(execution.index),
				disabled: false,
			},
		};
	},
	component: () => <Outlet />,
});
