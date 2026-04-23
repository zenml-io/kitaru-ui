import { deploymentsQueries } from "@/modules/deployments/business-logic/deployments-queries";
import { LOCAL_VERSION_ID } from "@/modules/deployments/domain/local-deployment";
import { DeploymentHeaderContainer } from "@/modules/deployments/feature/DeploymentHeaderContainer";
import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
import { ensureQueryDataOr404 } from "@/shared/api/utils/handle-404";
import {
	createFileRoute,
	Outlet,
	type SearchSchemaInput,
} from "@tanstack/react-router";
import { z } from "zod";

const flowSearchSchema = z.object({
	version: z
		.union([z.literal(LOCAL_VERSION_ID), z.coerce.number().int().positive()])
		.optional(),
	versions: z.enum(["all"]).optional(),
});

type FlowSearchSchemaInput = SearchSchemaInput & {
	version?: number | typeof LOCAL_VERSION_ID;
	versions?: "all";
};

function FlowRoute() {
	return (
		<>
			<DeploymentHeaderContainer />
			<Outlet />
		</>
	);
}

export const Route = createFileRoute("/_private/_navbar/flows/$flowId")({
	validateSearch: (search: FlowSearchSchemaInput) =>
		flowSearchSchema.parse(search),
	component: FlowRoute,
	loader: async ({ context, params }) => {
		const flow = await ensureQueryDataOr404(
			context.queryClient.ensureQueryData(flowsQueries.detail(params.flowId))
		);
		context.queryClient.ensureQueryData(deploymentsQueries.list(params.flowId));

		return {
			flowName: flow.name,
			crumb: {
				label: flow.name,
				disabled: false,
			},
		};
	},
});
