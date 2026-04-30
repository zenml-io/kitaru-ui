import { ExecutionContainer } from "@/modules/executions/feature/ExecutionContainer";
import { useCurrentDeployment } from "../business-logic/use-current-deployment";
import { useDeployments } from "../business-logic/use-deployments";
import { executionsFilter } from "../business-logic/version-execution-filter";

export function DeploymentExecutionContainer() {
	const { flowId, deployment } = useCurrentDeployment();
	const { data: realDeployments } = useDeployments(flowId);
	const filter = executionsFilter("version", deployment, realDeployments);

	return (
		<ExecutionContainer
			versionParam={deployment.version}
			serverFilterSnapshotId={filter.serverFilterSnapshotId}
			clientFilterRealSnapshotIds={filter.clientFilterRealSnapshotIds}
		/>
	);
}
