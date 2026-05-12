import { DeploymentExecutionsListContainer } from "@/modules/deployments/feature/DeploymentExecutionsListContainer";
import { FlowInvocationContainer } from "@/modules/deployments/feature/FlowInvocationContainer";
import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import {
	type FlowTab,
	flowTabLabels,
	flowTabs,
} from "@/modules/flows/domain/flow";
import { PageSpinner } from "@/shared/ui/spinner";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute, notFound } from "@tanstack/react-router";

function isFlowTab(value: string): value is FlowTab {
	return (flowTabs as readonly string[]).includes(value);
}

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/_tabs/$tab"
)({
	params: {
		parse: ({ tab, ...rest }) => {
			if (!isFlowTab(tab)) throw notFound();
			return { ...rest, tab };
		},
		stringify: ({ tab, ...rest }) => ({ ...rest, tab: String(tab) }),
	},
	loader: async ({ context, params }) => {
		if (params.tab === "executions") {
			await context.queryClient.ensureQueryData(
				executionsQueries.all(params.flowId)
			);
		}
	},
	component: TabComponent,
	pendingComponent: PageSpinner,
	head: ({ params }) => ({
		meta: [{ title: buildPageTitles(flowTabLabels[params.tab]) }],
	}),
});

function TabComponent() {
	const { tab } = Route.useParams();
	switch (tab) {
		case "invoke":
			return <FlowInvocationContainer />;
		case "executions":
			return <DeploymentExecutionsListContainer />;
	}
}
