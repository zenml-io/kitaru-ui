import { FlowInvocationContainer } from "@/modules/deployments/feature/FlowInvocationContainer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/_tabs/invoke"
)({
	component: FlowInvocationContainer,
});
