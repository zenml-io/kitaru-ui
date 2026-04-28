import { deploymentsQueries } from "@/modules/deployments/business-logic/deployments-queries";
import { resolveDefaultDeployment } from "@/modules/deployments/business-logic/resolve-deployment";
import { LOCAL_VERSION_ID } from "@/modules/deployments/domain/local-deployment";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/flows/$flowId/")({
	beforeLoad: async ({ context, params }) => {
		const realDeployments = await context.queryClient.ensureQueryData(
			deploymentsQueries.list(params.flowId)
		);
		const target =
			resolveDefaultDeployment(realDeployments) ??
			highestVersionDeployment(realDeployments);
		if (target) {
			throw redirect({
				to: "/flows/$flowId/v/$version/overview",
				params: { flowId: params.flowId, version: target.versionNumber },
			});
		}
		throw redirect({
			to: "/flows/$flowId/v/$version/overview",
			params: { flowId: params.flowId, version: LOCAL_VERSION_ID },
		});
	},
});

function highestVersionDeployment<T extends { versionNumber: number }>(
	deployments: T[]
): T | undefined {
	if (deployments.length === 0) return undefined;
	return deployments.reduce((acc, d) =>
		d.versionNumber > acc.versionNumber ? d : acc
	);
}
