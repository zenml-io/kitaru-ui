import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
import { FlowContextBarContainer } from "@/modules/flows/feature/FlowContextBarContainer";
import { ensureQueryDataOr404 } from "@/shared/api/utils/handle-404";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/flows/$flowId")({
	component: FlowLayout,
	loader: async ({ context, params }) => {
		await ensureQueryDataOr404(
			context.queryClient.ensureQueryData(flowsQueries.detail(params.flowId))
		);

		return {
			crumb: {
				label: params.flowId,
				href: `/flows/${params.flowId}`,
			},
		};
	},
});

function FlowLayout() {
	return (
		<>
			<FlowContextBarContainer />
			<Outlet />
		</>
	);
}
