import { DeploymentExecutionsListContainer } from "@/modules/deployments/feature/DeploymentExecutionsListContainer";
import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import { PageSpinner } from "@/shared/ui/spinner";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/_tabs/executions"
)({
	component: DeploymentExecutionsListContainer,
	pendingComponent: PageSpinner,
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			executionsQueries.all(params.flowId)
		);
	},
});
