import { checkpointsQueries } from "@zenml/shared-kitaru/modules/checkpoints";
import {
	executionsQueries,
	ReplayPageContainer,
	ReplayRouteProvider,
} from "@zenml/shared-kitaru/modules/executions";
import { ensureQueryDataOr404 } from "@/shared/api/utils/handle-404";
import { PageSpinner } from "@zenml/shared-kitaru/ui/spinner";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/executions/$executionId_/replay"
)({
	component: ReplayRouteAdapter,
	pendingComponent: PageSpinner,
	loader: async ({ context, params }) => {
		await Promise.all([
			ensureQueryDataOr404(
				context.queryClient.ensureQueryData(
					executionsQueries.detail(
						{ executionId: params.executionId },
						context
					)
				)
			),
			context.queryClient.ensureQueryData(
				checkpointsQueries.list({ executionId: params.executionId }, context)
			),
		]);
	},
});

function ReplayRouteAdapter() {
	const { flowId, version, executionId } = Route.useParams();
	const navigate = useNavigate();

	return (
		<ReplayRouteProvider
			state={{ flowId, version, executionId }}
			navigation={{
				goToExecution: (target) =>
					void navigate({
						to: "/flows/$flowId/v/$version/executions/$executionId",
						params: {
							flowId: target.flowId,
							version: target.version,
							executionId: target.executionId,
						},
					}),
				cancel: () =>
					void navigate({
						to: "/flows/$flowId/v/$version/executions/$executionId",
						params: { flowId, version, executionId },
					}),
			}}
		>
			<ReplayPageContainer />
		</ReplayRouteProvider>
	);
}
