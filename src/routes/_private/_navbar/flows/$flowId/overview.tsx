import { FlowOverviewContainer } from "@/modules/flows/feature/FlowOverviewContainer";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

function FlowOverviewRoute() {
	return (
		<Suspense>
			<FlowOverviewContainer />
		</Suspense>
	);
}

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/overview"
)({
	component: FlowOverviewRoute,
	head: () => ({
		meta: [{ title: buildPageTitles("Flow Overview") }],
	}),
	loader: async ({ params }) => {
		return {
			crumb: {
				label: params.flowId,
				href: `/flows/${params.flowId}/overview`,
			},
		};
	},
});
