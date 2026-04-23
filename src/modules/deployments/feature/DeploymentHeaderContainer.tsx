import { useQuery } from "@tanstack/react-query";
import { stacksQueries } from "@/modules/stacks/business-logic/stacks-queries";
import { isLocalDeployment } from "../domain/local-deployment";
import { useSelectedVersion } from "../business-logic/use-selected-version";
import { DeploymentHeader } from "../ui/DeploymentHeader";

export function DeploymentHeaderContainer() {
	const { flow, selected } = useSelectedVersion();

	const { data: stack } = useQuery({
		...stacksQueries.detail(selected?.stackId ?? ""),
		enabled: Boolean(selected?.stackId) && !isLocalDeployment(selected),
	});

	return (
		<DeploymentHeader
			flowName={flow.name}
			deployment={selected}
			stackComponents={stack?.components}
		/>
	);
}
