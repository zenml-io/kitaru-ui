import { deploymentsQueries } from "@/modules/deployments/business-logic/deployments-queries";
import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
import { ensureQueryDataOr404 } from "@/shared/api/utils/handle-404";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/flows/$flowId")({
	component: () => <Outlet />,
	loader: async ({ context, params }) => {
		const flow = await ensureQueryDataOr404(
			context.queryClient.ensureQueryData(flowsQueries.detail(params.flowId))
		);
		context.queryClient.ensureQueryData(deploymentsQueries.list(params.flowId));
		return {
			flowName: flow.name,
			crumb: { label: flow.name, disabled: false },
		};
	},
});
