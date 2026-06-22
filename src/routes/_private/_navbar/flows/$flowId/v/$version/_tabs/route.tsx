import { DeploymentHeaderContainer } from "@/modules/deployments/feature/DeploymentHeaderContainer";
import { FlowContextBarContainer } from "@/modules/flows/feature/FlowContextBarContainer";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/_tabs"
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { flowId, version } = Route.useParams();
	return (
		<>
			<DeploymentHeaderContainer />
			<FlowContextBarContainer flowId={flowId} version={version} />
			<Outlet />
		</>
	);
}
