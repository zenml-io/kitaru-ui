import * as React from "react";

import { FlowOverviewContainer } from "@/modules/flows/feature/FlowOverviewContainer";
import { PageSpinner } from "@/shared/ui/spinner";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { flowTabs, type FlowTab } from "@/modules/flows/domain/flow";
import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";

const TAB_TITLES: Record<FlowTab, string> = {
	overview: "Flow Overview",
	logs: "Flow Logs",
};

const tabSchema = z.enum(flowTabs);

const TAB_COMPONENTS: Record<FlowTab, React.ComponentType> = {
	overview: FlowOverviewContainer,
	logs: () => <div>Logs</div>,
};

export const Route = createFileRoute("/_private/_navbar/flows/$flowId/$tab")({
	params: {
		parse: ({ tab }) => ({ tab: tabSchema.parse(tab) }),
		stringify: ({ tab }) => ({ tab }),
	},
	component: FlowTabPage,
	pendingComponent: PageSpinner,
	head: ({ match }) => ({
		meta: [{ title: buildPageTitles(TAB_TITLES[match.params.tab]) }],
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
