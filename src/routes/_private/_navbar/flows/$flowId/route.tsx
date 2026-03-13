import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
import { FlowContextBarContainer } from "@/modules/flows/feature/FlowContextBarContainer";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/flows/$flowId")({
	component: FlowLayout,
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			flowsQueries.detail(params.flowId)
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
