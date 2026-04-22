import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
import { deploymentsQueries } from "../business-logic/deployments-queries";
import { resolveSelectedDeployment } from "../business-logic/resolve-deployment";
import { DeploymentHeader } from "../ui/DeploymentHeader";

export function DeploymentHeaderContainer() {
	const { flowId } = useParams({ from: "/_private/_navbar/flows/$flowId" });
	const { version } = useSearch({
		from: "/_private/_navbar/flows/$flowId",
	});

	const { data: flow } = useSuspenseQuery(flowsQueries.detail(flowId));
	const { data: deployments } = useSuspenseQuery(
		deploymentsQueries.list(flowId)
	);

	const selected = resolveSelectedDeployment(deployments, version);

	return <DeploymentHeader flowName={flow.name} deployment={selected} />;
}
