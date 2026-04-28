import { deploymentsQueries } from "@/modules/deployments/business-logic/deployments-queries";
import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import { FlowExecutionsContainer } from "@/modules/flows/feature/FlowExecutionsContainer";
import { PageSpinner } from "@/shared/ui/spinner";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/executions"
)({
	loader: ({ context, params }) =>
		Promise.all([
			context.queryClient.ensureQueryData(
				deploymentsQueries.list(params.flowId)
			),
			context.queryClient.ensureQueryData(executionsQueries.all(params.flowId)),
		]),
	component: () => <FlowExecutionsContainer scope="all" />,
	pendingComponent: PageSpinner,
	head: () => ({ meta: [{ title: buildPageTitles("Executions") }] }),
});
