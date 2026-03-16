import { FlowOverviewContainer } from "@/modules/flows/feature/FlowOverviewContainer";
import { PageSpinner } from "@/shared/ui/spinner";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/flows/$flowId/execs/")({
	component: FlowOverviewContainer,
	pendingComponent: PageSpinner,
	head: () => ({
		meta: [{ title: buildPageTitles("Executions") }],
	}),
});
