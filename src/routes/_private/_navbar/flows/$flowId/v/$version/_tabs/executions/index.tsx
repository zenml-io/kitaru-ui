import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import { DeploymentExecutionsListContainer } from "@/modules/deployments/feature/DeploymentExecutionsListContainer";
import { PageSpinner } from "@/shared/ui/spinner";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/_tabs/executions/"
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(executionsQueries.all(params.flowId)),
	component: DeploymentExecutionsListContainer,
	pendingComponent: PageSpinner,
	head: () => ({ meta: [{ title: buildPageTitles("Executions") }] }),
});
