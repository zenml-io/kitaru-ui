import { useQuery } from "@tanstack/react-query";
import { stacksQueries } from "@/modules/stacks/business-logic/stacks-queries";
import { isLocalDeployment } from "../domain/local-deployment";
import { useSelectedDeployment } from "../business-logic/use-selected-deployment";
import { DeploymentHeader } from "../ui/DeploymentHeader";

export function DeploymentHeaderContainer() {
	const { selected } = useSelectedDeployment();

	const { data: stack } = useQuery({
		...stacksQueries.detail(selected.stackId ?? ""),
		enabled: Boolean(selected.stackId) && !isLocalDeployment(selected),
	});

	return (
		<DeploymentHeader
			flowName={selected.flowName}
			deployment={selected}
			stackComponents={stack?.components}
		/>
	);
}
