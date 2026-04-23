import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { env } from "@/modules/root/domain/env";
import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
import { deploymentsQueries } from "../business-logic/deployments-queries";
import { resolveSelectedDeployment } from "../business-logic/resolve-deployment";
import {
	isLocalDeployment,
	withLocalDeployment,
} from "../domain/local-deployment";
import { InvocationUrlBlock } from "../ui/InvocationUrlBlock";
import { InvokeDeploymentContainer } from "./InvokeDeploymentContainer";

export function FlowInvokeActionsContainer() {
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

	if (!selected || isLocalDeployment(selected)) return null;

	const origin = env.VITE_API_BASE_URL || window.location.origin;
	const url = `${origin}/api/v1/pipeline_snapshots/${selected.id}/runs`;

	return (
		<div className="flex items-center gap-2">
			<InvocationUrlBlock url={url} className="w-[480px] max-w-[50vw]" />
			<InvokeDeploymentContainer deployment={selected} />
		</div>
	);
}
