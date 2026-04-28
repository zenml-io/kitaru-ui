import { FlowInvocationContainer } from "@/modules/deployments/feature/FlowInvocationContainer";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/_tabs/overview"
)({
	component: FlowInvocationContainer,
	head: () => ({ meta: [{ title: buildPageTitles("Overview") }] }),
});
