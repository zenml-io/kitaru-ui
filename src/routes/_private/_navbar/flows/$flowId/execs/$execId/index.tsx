import { ExecutionContainer } from "@/modules/executions/feature/ExecutionContainer";
import { PageSpinner } from "@/shared/ui/spinner";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/execs/$execId/"
)({
	component: ExecutionContainer,
	pendingComponent: PageSpinner,
	head: () => ({
		meta: [{ title: buildPageTitles("Execution") }],
	}),
});
