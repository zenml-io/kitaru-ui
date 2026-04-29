import { deploymentsQueries } from "@/modules/deployments/business-logic/deployments-queries";
import { parseVersionPathParam } from "@/modules/deployments/business-logic/parse-version-path-param";
import {
	buildLocalDeployment,
	LOCAL_VERSION_ID,
} from "@/modules/deployments/domain/local-deployment";
import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
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
			context.queryClient.ensureQueryData(flowsQueries.detail(params.flowId))
		);
		// Warm the full list in the background for the version switcher and other
		// consumers — don't await; this loader should only block on the single
		// deployment we actually need to render.
		void context.queryClient.ensureQueryData(
			deploymentsQueries.list(params.flowId)
		);
		const selected =
			params.version === LOCAL_VERSION_ID
				? buildLocalDeployment(params.flowId, flow.name)
				: await context.queryClient.ensureQueryData(
						deploymentsQueries.byVersion(
							params.flowId,
							flow.name,
							params.version
						)
					);
		if (!selected) throw notFound();
		return { selected };
	},
	component: () => <Outlet />,
});
