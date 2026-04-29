import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { deploymentsQueries } from "../business-logic/deployments-queries";
import { resolveDefaultDeployment } from "../business-logic/resolve-deployment";
import { useCurrentDeployment } from "../business-logic/use-current-deployment";
import {
	buildLocalDeployment,
	type DeploymentVersion,
} from "../domain/deployment";
import { DeploymentVersionSwitcherPill } from "../ui/DeploymentVersionSwitcherPill";

export function DeploymentVersionSwitcherContainer() {
	const { flowId, deployment } = useCurrentDeployment();
	const navigate = useNavigate();
	const { data: realDeployments } = useQuery(deploymentsQueries.list(flowId));

	if (!realDeployments) return null;

	const localEntry = buildLocalDeployment(flowId, deployment.flowName);
	const defaultHolder = resolveDefaultDeployment(realDeployments);
	const restRealVersions = realDeployments.filter(
		(d) => d.id !== defaultHolder?.id
	);
	const selectedDefaultTag = deployment.tags.find((t) => t.kind === "default");

	function handleSelect(next: DeploymentVersion) {
		navigate({
			to: "/flows/$flowId/v/$version/executions",
			params: { flowId, version: next },
		});
	}

	return (
		<DeploymentVersionSwitcherPill
			selected={deployment}
			selectedDefaultTag={selectedDefaultTag}
			defaultHolder={defaultHolder}
			restRealVersions={restRealVersions}
			localEntry={localEntry}
			onSelect={handleSelect}
		/>
	);
}
