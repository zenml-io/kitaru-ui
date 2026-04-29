import { useNavigate } from "@tanstack/react-router";
import { categorizeDeployments } from "../business-logic/categorize-deployments";
import { useSelectedDeployment } from "../business-logic/use-selected-deployment";
import { LOCAL_VERSION_ID } from "../domain/local-deployment";
import { DeploymentVersionSwitcherPill } from "../ui/DeploymentVersionSwitcherPill";

export function DeploymentVersionSwitcherContainer() {
	const { flowId, deployments, selected } = useSelectedDeployment();
	const navigate = useNavigate();

	const categorized = categorizeDeployments(deployments, selected.id);
	if (!categorized) return null;

	function handleSelect(next: number | typeof LOCAL_VERSION_ID) {
		navigate({
			to: "/flows/$flowId/v/$version/executions",
			params: { flowId, version: next },
		});
	}

	return (
		<DeploymentVersionSwitcherPill {...categorized} onSelect={handleSelect} />
	);
}
