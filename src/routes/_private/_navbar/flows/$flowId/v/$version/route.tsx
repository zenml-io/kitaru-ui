import { deploymentsQueries } from "@zenml/shared-kitaru/modules/deployments";
import { parseVersionPathParam } from "@zenml/shared-kitaru/modules/deployments";
import { flowsQueries } from "@zenml/shared-kitaru/modules/flows";
import { ensureQueryDataOr404 } from "@/shared/api/utils/handle-404";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version"
)({
	params: {
		parse: ({ version, ...rest }) => {
			const parsed = parseVersionPathParam(version);
			if (parsed === undefined) throw notFound();
			return { ...rest, version: parsed };
		},
		stringify: ({ version, ...rest }) => ({
			...rest,
			version: String(version),
		}),
	},
	loader: async ({ context, params }) => {
		const flow = await ensureQueryDataOr404(
			context.queryClient.ensureQueryData(
				flowsQueries.detail(
					{
						flowId: params.flowId,
					},
					context
				)
			)
		);
		const deployment = await context.queryClient.ensureQueryData(
			deploymentsQueries.currentDeployment(
				{
					flowId: params.flowId,
					flowName: flow.name,
					version: params.version,
				},
				context
			)
		);
		if (!deployment) throw notFound();
		return { deployment };
	},
	component: () => <Outlet />,
});
