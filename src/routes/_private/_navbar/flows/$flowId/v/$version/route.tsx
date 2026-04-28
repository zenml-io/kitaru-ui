import { deploymentsQueries } from "@/modules/deployments/business-logic/deployments-queries";
import { parseVersionPathParam } from "@/modules/deployments/business-logic/parse-version-path-param";
import {
	isLocalDeployment,
	LOCAL_VERSION_ID,
	withLocalDeployment,
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
	beforeLoad: async ({ context, params }) => {
		if (params.version === LOCAL_VERSION_ID) return;
		const realDeployments = await context.queryClient.ensureQueryData(
			deploymentsQueries.list(params.flowId)
		);
		const exists = realDeployments.some(
			(d) => d.versionNumber === params.version
		);
		if (!exists) throw notFound();
	},
	loader: async ({ context, params }) => {
		const [flow, realDeployments] = await Promise.all([
			ensureQueryDataOr404(
				context.queryClient.ensureQueryData(flowsQueries.detail(params.flowId))
			),
			context.queryClient.ensureQueryData(
				deploymentsQueries.list(params.flowId)
			),
		]);
		const deployments = withLocalDeployment(
			realDeployments,
			params.flowId,
			flow.name
		);
		const selected =
			params.version === LOCAL_VERSION_ID
				? deployments.find(isLocalDeployment)
				: realDeployments.find((d) => d.versionNumber === params.version);
		if (!selected) throw notFound();
		return { flow, realDeployments, deployments, selected };
	},
	component: () => <Outlet />,
});
