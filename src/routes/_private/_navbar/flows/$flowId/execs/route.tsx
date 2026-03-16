import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/flows/$flowId/execs")({
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			executionsQueries.all(params.flowId)
		);
	},
	component: () => <Outlet />,
});
