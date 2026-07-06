import { checkpointsQueries } from "@zenml/shared-kitaru/modules/checkpoints";
import { DeploymentExecutionContainer } from "@zenml/shared-kitaru/modules/deployments";
import { executionsQueries } from "@zenml/shared-kitaru/modules/executions";
import { formatExecutionIndex } from "@zenml/shared-kitaru/modules/executions";
import { ensureQueryDataOr404 } from "@/shared/api/utils/handle-404";
import { PageSpinner } from "@zenml/shared-kitaru/ui/spinner";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import {
	ExecutionDetailRouteProvider,
	type ExecutionDetailSearch,
	type ExecutionLinkProps,
} from "@zenml/shared-kitaru/modules/executions";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

function validateExecutionSearch(
	search: Record<string, unknown>
): ExecutionDetailSearch {
	const out: ExecutionDetailSearch = {};
	if (search.tab === "logs") out.tab = "logs";
	if (typeof search.scope === "string" && search.scope.length > 0) {
		out.scope = search.scope;
	}
	return out;
}

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/executions/$executionId"
)({
	component: ExecutionDetailRouteAdapter,
	pendingComponent: PageSpinner,
	validateSearch: validateExecutionSearch,

	loader: async ({ context, params }) => {
		const [, execution] = await Promise.all([
			context.queryClient.ensureQueryData(
				executionsQueries.list(
					{
						flowId: params.flowId,
					},
					context
				)
			),
			ensureQueryDataOr404(
				context.queryClient.ensureQueryData(
					executionsQueries.detail(
						{
							executionId: params.executionId,
						},
						context
					)
				)
			),
			context.queryClient.ensureQueryData(
				checkpointsQueries.list(
					{
						executionId: params.executionId,
					},
					context
				)
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

const ROUTE_PATH =
	"/flows/$flowId/v/$version/executions/$executionId" as const;

function LinkToExecution({
	flowId,
	version,
	executionId,
	keepLogsTab,
	ariaCurrent,
	className,
	children,
}: ExecutionLinkProps) {
	return (
		<Link
			to={ROUTE_PATH}
			params={{ flowId, version, executionId }}
			search={keepLogsTab ? { tab: "logs" } : {}}
			aria-current={ariaCurrent}
			className={className}
		>
			{children}
		</Link>
	);
}

function ExecutionDetailRouteAdapter() {
	const { flowId, version, executionId } = Route.useParams();
	const { tab, scope } = Route.useSearch();
	const navigate = useNavigate();

	function updateSearch(next: ExecutionDetailSearch) {
		void navigate({
			to: ROUTE_PATH,
			params: { flowId, version, executionId },
			search: next,
			replace: true,
		});
	}

	function goToExecution(target: {
		flowId: string;
		version: "local" | number;
		executionId: string;
	}) {
		void navigate({
			to: ROUTE_PATH,
			params: {
				flowId: target.flowId,
				version: target.version,
				executionId: target.executionId,
			},
			search: {},
		});
	}

	function goToReplay(targetExecutionId: string) {
		void navigate({
			to: "/flows/$flowId/v/$version/executions/$executionId/replay",
			params: { flowId, version, executionId: targetExecutionId },
		});
	}

	function redirectToFlow(targetFlowId: string) {
		void navigate({ to: "/flows/$flowId", params: { flowId: targetFlowId } });
	}

	return (
		<ExecutionDetailRouteProvider
			state={{ flowId, version, executionId, tab, scope }}
			navigation={{ updateSearch, goToExecution, goToReplay, redirectToFlow, LinkToExecution }}
		>
			<DeploymentExecutionContainer />
		</ExecutionDetailRouteProvider>
	);
}
