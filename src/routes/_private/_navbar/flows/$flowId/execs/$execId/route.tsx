import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/execs/$execId"
)({
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			executionsQueries.all(params.flowId)
		);

		return {
			crumb: {
				label: params.execId,
				href: `/flows/${params.flowId}/execs/${params.execId}`,
			},
		};
	},
	component: () => <Outlet />,
});
