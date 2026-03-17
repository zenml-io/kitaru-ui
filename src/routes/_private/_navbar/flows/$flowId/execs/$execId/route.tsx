import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import { checkpointsQueries } from "@/modules/checkpoints/business-logic/checkpoints-queries";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/execs/$execId"
)({
	loader: async ({ context, params }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(executionsQueries.all(params.flowId)),
			context.queryClient.ensureQueryData(
				executionsQueries.detail(params.execId)
			),
			context.queryClient.ensureQueryData(
				checkpointsQueries.all(params.execId)
			),
		]);

		return {
			crumb: {
				label: params.execId,
				href: `/flows/${params.flowId}/execs/${params.execId}`,
			},
		};
	},
	component: () => <Outlet />,
});
