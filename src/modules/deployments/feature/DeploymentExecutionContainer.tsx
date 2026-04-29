import { ExecutionContainer } from "@/modules/executions/feature/ExecutionContainer";
import { useCurrentDeployment } from "../business-logic/use-current-deployment";
import { useDeployments } from "../business-logic/use-deployments";
import { LOCAL_VERSION_ID } from "../domain/deployment";

export function DeploymentExecutionContainer() {
	const { flowId, deployment } = useCurrentDeployment();
	const { data: realDeployments } = useDeployments(flowId);

	const isLocal = deployment.version === LOCAL_VERSION_ID;

	return (
		<ExecutionContainer
			versionParam={deployment.version}
			serverFilterSnapshotId={isLocal ? undefined : deployment.id}
			clientFilterRealSnapshotIds={
				isLocal ? new Set(realDeployments.map((d) => d.id)) : undefined
			}
		/>
	);
}
