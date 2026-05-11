import { DeploymentExecutionsListContainer } from "@/modules/deployments/feature/DeploymentExecutionsListContainer";
import { executionsQueries } from "@/modules/executions/business-logic/executions-queries";
import { PageSpinner } from "@/shared/ui/spinner";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { z } from "zod";

const executionQuerySchema = z.object({
	page: z.number().int().positive().default(1),
});

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/_tabs/executions"
)({
	component: DeploymentExecutionsListContainer,
	pendingComponent: PageSpinner,
	validateSearch: executionQuerySchema,
	loaderDeps: ({ search }) => {
		return {
			page: search.page,
		};
	},
	search: {
		middlewares: [stripSearchParams({ page: 1 })],
	},
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			executionsQueries.all(params.flowId)
		);
	},
});
