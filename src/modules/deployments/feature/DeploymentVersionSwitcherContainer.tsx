import { useNavigate } from "@tanstack/react-router";
import { resolveDefaultDeployment } from "../business-logic/resolve-deployment";
import { useCurrentDeployment } from "../business-logic/use-current-deployment";
import { useDeployments } from "../business-logic/use-deployments";
import {
	buildLocalDeployment,
	type DeploymentVersion,
} from "../domain/deployment";
import { DeploymentVersionSwitcherPill } from "../ui/DeploymentVersionSwitcherPill";

export function DeploymentVersionSwitcherContainer() {
	const { flowId, deployment } = useCurrentDeployment();
	const navigate = useNavigate();
	const { data: realDeployments } = useDeployments(flowId);

	const localEntry = buildLocalDeployment(flowId, deployment.flowName);
	const defaultHolder = resolveDefaultDeployment(realDeployments);
	const restRealVersions = realDeployments.filter(
		(d) => d.id !== defaultHolder?.id
	);
	const selectedDefaultTag = deployment.tags.find((t) => t.kind === "default");

	function handleSelect(next: DeploymentVersion) {
		navigate({
			to: "/flows/$flowId/v/$version/$tab",
			params: { flowId, version: next, tab: "executions" },
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
