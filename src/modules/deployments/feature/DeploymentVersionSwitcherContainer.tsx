import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
import { deploymentsQueries } from "../business-logic/deployments-queries";
import { resolveSelectedDeployment } from "../business-logic/resolve-deployment";
import { withLocalDeployment } from "../domain/local-deployment";
import { DeploymentVersionSwitcherPill } from "../ui/DeploymentVersionSwitcherPill";

export function DeploymentVersionSwitcherContainer() {
	const { flowId } = useParams({ from: "/_private/_navbar/flows/$flowId" });
	const { version } = useSearch({
		from: "/_private/_navbar/flows/$flowId",
	});
	const navigate = useNavigate();
	const { data: flow } = useSuspenseQuery(flowsQueries.detail(flowId));
	const { data: realDeployments } = useSuspenseQuery(
		deploymentsQueries.list(flowId)
	);
	const deployments = withLocalDeployment(realDeployments, flowId, flow.name);
	const selected = resolveSelectedDeployment(deployments, version);

	function handleSelect(next: number | "local") {
		navigate({
			to: ".",
			search: (prev) => ({ ...prev, version: next }),
		});
	}

	return (
		<DeploymentVersionSwitcherPill
			deployments={deployments}
			selectedId={selected?.id}
			onSelect={handleSelect}
		/>
	);
}
