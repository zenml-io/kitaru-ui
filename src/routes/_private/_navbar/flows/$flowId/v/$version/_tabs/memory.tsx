import { memoryQueries } from "@/modules/memory/business-logic/memory-queries";
import { FlowMemoryContainer } from "@/modules/memory/feature/FlowMemoryContainer";
import { PageSpinner } from "@/shared/ui/spinner";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/_tabs/memory"
)({
	loader: ({ context, params }) =>
		Promise.all([
			context.queryClient.ensureQueryData(memoryQueries.namespaces()),
			context.queryClient.ensureQueryData(memoryQueries.flow(params.flowId)),
			context.queryClient.ensureQueryData(
				memoryQueries.executions(params.flowId)
			),
		]),
	component: FlowMemoryContainer,
	pendingComponent: PageSpinner,
	head: () => ({ meta: [{ title: buildPageTitles("Memory") }] }),
});
