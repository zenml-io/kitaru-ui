import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
import { flowTabs, type FlowTab } from "@/modules/flows/domain/flow";
import { FlowOverviewContainer } from "@/modules/flows/feature/FlowOverviewContainer";
import { ensureQueryDataOr404 } from "@/shared/api/utils/handle-404";
import { PageSpinner } from "@/shared/ui/spinner";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const tabSchema = z.enum(flowTabs);

const TAB_TITLES: Record<FlowTab, string> = {
	overview: "Overview",
};

const TAB_COMPONENTS: Record<FlowTab, React.ComponentType> = {
	overview: FlowOverviewContainer,
};

export const Route = createFileRoute("/_private/_navbar/flows/$flowId/$tab")({
	params: {
		parse: ({ tab }) => ({ tab: tabSchema.parse(tab) }),
	},
	loader: async ({ context, params }) => {
		const flow = await ensureQueryDataOr404(
			context.queryClient.ensureQueryData(flowsQueries.detail(params.flowId))
		);

		return {
			flowName: flow.name,
			crumb: {
				label: "Overview",
				disabled: true,
			},
		};
	},
	component: FlowTabPage,
	pendingComponent: PageSpinner,
	head: ({ match, loaderData }) => ({
		meta: [
			{
				title: buildPageTitles(
					`${loaderData?.flowName} - ${TAB_TITLES[match.params.tab]}`
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
	const { tab } = Route.useParams();
	const Component = TAB_COMPONENTS[tab];
	return <Component />;
}
