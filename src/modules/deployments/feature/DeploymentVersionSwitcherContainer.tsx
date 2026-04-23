import { useNavigate } from "@tanstack/react-router";
import { LOCAL_VERSION_ID } from "../domain/local-deployment";
import { useSelectedVersion } from "../business-logic/use-selected-version";
import { DeploymentVersionSwitcherPill } from "../ui/DeploymentVersionSwitcherPill";

export function DeploymentVersionSwitcherContainer() {
	const { deployments, selected } = useSelectedVersion();
	const navigate = useNavigate();

	function handleSelect(next: number | typeof LOCAL_VERSION_ID) {
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
