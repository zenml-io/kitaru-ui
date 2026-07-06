import { deploymentsQueries } from "@zenml/shared-kitaru/modules/deployments";
import { flowsQueries } from "@zenml/shared-kitaru/modules/flows";
import { ensureQueryDataOr404 } from "@/shared/api/utils/handle-404";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/flows/$flowId")({
	component: () => <Outlet />,
	loader: async ({ context, params }) => {
		const flow = await ensureQueryDataOr404(
			context.queryClient.ensureQueryData(
				flowsQueries.detail(
					{
						flowId: params.flowId,
					},
					context
				)
			)
		);
		context.queryClient.ensureQueryData(
			deploymentsQueries.list(
				{
					flowId: params.flowId,
				},
				context
			)
		);
		return {
			flowName: flow.name,
			crumb: { label: flow.name, disabled: false },
		};
	},
});
