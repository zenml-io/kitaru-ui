import { DeploymentHeaderContainer } from "@/modules/deployments/feature/DeploymentHeaderContainer";
import { FlowContextBarContainer } from "@/modules/flows/feature/FlowContextBarContainer";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/_tabs"
)({
	component: () => (
		<>
			<DeploymentHeaderContainer />
			<FlowContextBarContainer />
			<Outlet />
		</>
	),
});
