import { stacksQueries } from "@/modules/stacks/business-logic/stacks-queries";
import { useQuery } from "@tanstack/react-query";
import { useCurrentDeployment } from "../business-logic/use-current-deployment";
import { DeploymentHeader } from "../ui/DeploymentHeader";

export function DeploymentHeaderContainer() {
	const { deployment } = useCurrentDeployment();

	const { data: stack } = useQuery({
		...stacksQueries.detail(deployment.stackId ?? ""),
		enabled: Boolean(deployment.stackId),
	});

	return (
		<DeploymentHeader
			flowName={deployment.flowName}
			deployment={deployment}
			stackComponents={stack?.components}
		/>
	);
}
