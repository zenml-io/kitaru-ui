import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/executions/"
)({
	beforeLoad: async ({ context, params }) => {
		const executions = await context.queryClient.ensureQueryData(
			executionsQueries.all(params.flowId)
		);

		if (executions[0]) {
			throw redirect({
				to: "/flows/$flowId/executions/$executionId",
				params: { flowId: params.flowId, executionId: executions[0].id },
			});
		}
	},
	head: () => ({
		meta: [{ title: buildPageTitles("Executions") }],
	}),
});
