import { deploymentsQueries } from "@zenml/shared-kitaru/modules/deployments";
import { resolveDefaultDeployment } from "@zenml/shared-kitaru/modules/deployments";
import {
	LOCAL_VERSION_ID,
	type Deployment,
} from "@zenml/shared-kitaru/modules/deployments";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/flows/$flowId/")({
	beforeLoad: async ({ context, params }) => {
		const realDeployments = await context.queryClient.ensureQueryData(
			deploymentsQueries.list(
				{
					flowId: params.flowId,
				},
				context
			)
		);
		const target =
			resolveDefaultDeployment(realDeployments) ??
			highestVersionDeployment(realDeployments);
		throw redirect({
			to: "/flows/$flowId/v/$version/$tab",
			params: {
				flowId: params.flowId,
				version: target?.version ?? LOCAL_VERSION_ID,
				tab: "executions",
			},
		});
	},
});

function highestVersionDeployment(
	deployments: Deployment[]
): Deployment | undefined {
	const real = deployments.filter(
		(d): d is Deployment & { version: number } => typeof d.version === "number"
	);
	if (real.length === 0) return undefined;
	return real.reduce((acc, d) => (d.version > acc.version ? d : acc));
}
