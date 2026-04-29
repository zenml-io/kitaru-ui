import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { deploymentsQueries } from "../business-logic/deployments-queries";
import { resolveDefaultDeployment } from "../business-logic/resolve-deployment";
import { useSelectedDeployment } from "../business-logic/use-selected-deployment";
import {
	isLocalDeployment,
	LOCAL_VERSION_ID,
	withLocalDeployment,
} from "../domain/local-deployment";
import { DeploymentVersionSwitcherPill } from "../ui/DeploymentVersionSwitcherPill";

export function DeploymentVersionSwitcherContainer() {
	const { flowId, flow, selected } = useSelectedDeployment();
	const navigate = useNavigate();
	const { data: realDeployments } = useQuery(deploymentsQueries.list(flowId));

	if (!realDeployments) return null;

	const deploymentsWithLocal = withLocalDeployment(
		realDeployments,
		flowId,
		flow.name
	);
	const defaultHolder = resolveDefaultDeployment(deploymentsWithLocal);
	const localEntry = deploymentsWithLocal.find(isLocalDeployment);
	const restRealVersions = deploymentsWithLocal.filter(
		(d) => d.id !== defaultHolder?.id && !isLocalDeployment(d)
	);
	const selectedDefaultTag = selected.tags.find((t) => t.kind === "default");

	function handleSelect(next: number | typeof LOCAL_VERSION_ID) {
		navigate({
			to: "/flows/$flowId/v/$version/executions",
			params: { flowId, version: next },
		});
	}

	return (
		<DeploymentVersionSwitcherPill
			selected={selected}
			selectedDefaultTag={selectedDefaultTag}
			defaultHolder={defaultHolder}
			restRealVersions={restRealVersions}
			localEntry={localEntry}
			onSelect={handleSelect}
		/>
	);
}
