import { checkpointsQueries } from "@/modules/checkpoints/business-logic/checkpoints-queries";
import { ExecutionContainer } from "@/modules/executions/feature/ExecutionContainer";
import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import { formatExecutionIndex } from "@/modules/executions/util/execution";
import { memoryQueries } from "@/modules/memory/business-logic/memory-queries";
import { ensureQueryDataOr404 } from "@/shared/api/utils/handle-404";
import { PageSpinner } from "@/shared/ui/spinner";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

type ExecutionSearch = {
	tab?: "logs";
	scope?: string;
};

function validateExecutionSearch(
	search: Record<string, unknown>
): ExecutionSearch {
	const out: ExecutionSearch = {};
	if (search.tab === "logs") out.tab = "logs";
	if (typeof search.scope === "string" && search.scope.length > 0) {
		out.scope = search.scope;
	}
	return out;
}

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/executions/$executionId"
)({
	component: ExecutionContainer,
	pendingComponent: PageSpinner,
	validateSearch: validateExecutionSearch,

	loader: async ({ context, params }) => {
		const [, execution] = await Promise.all([
			context.queryClient.ensureQueryData(executionsQueries.all(params.flowId)),
			ensureQueryDataOr404(
				context.queryClient.ensureQueryData(
					executionsQueries.detail(params.executionId)
				)
			),
			context.queryClient.ensureQueryData(
				checkpointsQueries.all(params.executionId)
			),
		]);

		context.queryClient.ensureQueryData(memoryQueries.namespaces());
		context.queryClient.ensureQueryData(memoryQueries.flow(params.flowId));
		context.queryClient.ensureQueryData(
			memoryQueries.execution(params.executionId)
		);

		return {
			executionIndex: formatExecutionIndex(execution.index),
			crumb: {
				label: `#${formatExecutionIndex(execution.index)}`,
				disabled: false,
			},
		};
	},
	head: ({ loaderData }) => ({
		meta: [
			{ title: buildPageTitles(`Execution #${loaderData?.executionIndex}`) },
		],
	}),
});
