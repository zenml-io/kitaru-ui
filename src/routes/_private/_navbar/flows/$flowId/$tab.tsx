import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
import {
	flowTabLabels,
	flowTabs,
	type FlowTab,
} from "@/modules/flows/domain/flow";
import { FlowInvocationContainer } from "@/modules/deployments/feature/FlowInvocationContainer";
import { FlowContextBarContainer } from "@/modules/flows/feature/FlowContextBarContainer";
import { FlowExecutionsContainer } from "@/modules/flows/feature/FlowExecutionsContainer";
import { memoryQueries } from "@/modules/memory/business-logic/memory-queries";
import { FlowMemoryContainer } from "@/modules/memory/feature/FlowMemoryContainer";
import { ensureQueryDataOr404 } from "@/shared/api/utils/handle-404";
import { PageSpinner } from "@/shared/ui/spinner";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const tabSchema = z.enum(flowTabs);

const TAB_COMPONENTS: Record<FlowTab, React.ComponentType> = {
	overview: FlowInvocationContainer,
	executions: FlowExecutionsContainer,
	memory: FlowMemoryContainer,
};

export const Route = createFileRoute("/_private/_navbar/flows/$flowId/$tab")({
	params: {
		parse: ({ tab }) => ({ tab: tabSchema.parse(tab) }),
	},
	loader: async ({ context, params }) => {
		const flow = await ensureQueryDataOr404(
			context.queryClient.ensureQueryData(flowsQueries.detail(params.flowId))
		);

		if (params.tab === "memory") {
			context.queryClient.ensureQueryData(memoryQueries.namespaces());
			context.queryClient.ensureQueryData(memoryQueries.flow(params.flowId));
			context.queryClient.ensureQueryData(
				memoryQueries.executions(params.flowId)
			);
		}

		return {
			flowName: flow.name,
			crumb: {
				label: flowTabLabels[params.tab],
				disabled: false,
			},
		};
	},
	component: FlowTabPage,
	pendingComponent: PageSpinner,
	head: ({ match, loaderData }) => ({
		meta: [
			{
				title: buildPageTitles(
					`${loaderData?.flowName} - ${flowTabLabels[match.params.tab]}`
				),
			},
		],
	}),
	beforeLoad: ({ params }) => {
		if (!tabSchema.safeParse(params.tab).success) {
			throw redirect({
				to: "/flows/$flowId/$tab",
				params: { flowId: params.flowId, tab: "overview" },
			});
		}
	},
});

function FlowTabPage() {
	const { flowId, tab } = Route.useParams();
	const Component = TAB_COMPONENTS[tab];
	return (
		<>
			<FlowContextBarContainer />
			<Component key={flowId} />
		</>
	);
}
