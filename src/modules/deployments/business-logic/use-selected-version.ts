import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
import type { Flow } from "@/modules/flows/domain/flow";
import type { Deployment } from "../domain/deployment";
import { withLocalDeployment } from "../domain/local-deployment";
import { deploymentsQueries } from "./deployments-queries";
import { resolveSelectedDeployment } from "./resolve-deployment";

export type UseSelectedVersionResult = {
	flowId: string;
	flow: Flow;
	realDeployments: Deployment[];
	deployments: Deployment[];
	selected: Deployment | undefined;
};

export function useSelectedVersion(): UseSelectedVersionResult {
	const { flowId } = useParams({ from: "/_private/_navbar/flows/$flowId" });
	const { version } = useSearch({
		from: "/_private/_navbar/flows/$flowId",
	});
	const { data: flow } = useSuspenseQuery(flowsQueries.detail(flowId));
	const { data: realDeployments } = useSuspenseQuery(
		deploymentsQueries.list(flowId)
	);
	const deployments = withLocalDeployment(realDeployments, flowId, flow.name);
	const selected = resolveSelectedDeployment(deployments, version);
	return { flowId, flow, realDeployments, deployments, selected };
}
