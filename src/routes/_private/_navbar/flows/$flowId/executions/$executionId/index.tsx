import { checkpointsQueries } from "@/modules/checkpoints/business-logic/checkpoints-queries";
import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import { ExecutionContainer } from "@/modules/executions/feature/ExecutionContainer";
import { formatExecutionIndex } from "@/modules/executions/util/execution";
import { ensureQueryDataOr404 } from "@/shared/api/utils/handle-404";
import { PageSpinner } from "@/shared/ui/spinner";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/executions/$executionId/"
)({
	component: ExecutionContainer,
	pendingComponent: PageSpinner,

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
