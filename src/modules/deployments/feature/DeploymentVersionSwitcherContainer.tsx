import { useNavigate } from "@tanstack/react-router";
import { LOCAL_VERSION_ID } from "../domain/local-deployment";
import { useSelectedDeployment } from "../business-logic/use-selected-deployment";
import { DeploymentVersionSwitcherPill } from "../ui/DeploymentVersionSwitcherPill";

export function DeploymentVersionSwitcherContainer() {
	const { flowId, deployments, selected } = useSelectedDeployment();
	const navigate = useNavigate();

	function handleSelect(next: number | typeof LOCAL_VERSION_ID) {
		navigate({
			to: "/flows/$flowId/v/$version/executions",
			params: { flowId, version: next },
		});
	}

	return (
		<DeploymentVersionSwitcherPill
			deployments={deployments}
			selectedId={selected.id}
			onSelect={handleSelect}
		/>
	);
}
