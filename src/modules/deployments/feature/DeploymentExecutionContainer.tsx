import { useQuery } from "@tanstack/react-query";
import { ExecutionContainer } from "@/modules/executions/feature/ExecutionContainer";
import { deploymentsQueries } from "../business-logic/deployments-queries";
import { useCurrentDeployment } from "../business-logic/use-current-deployment";
import { LOCAL_VERSION_ID } from "../domain/deployment";

export function DeploymentExecutionContainer() {
	const { flowId, deployment } = useCurrentDeployment();
	const { data: realDeployments } = useQuery(deploymentsQueries.list(flowId));

	const isLocal = deployment.version === LOCAL_VERSION_ID;

	return (
		<ExecutionContainer
			versionParam={deployment.version}
			serverFilterSnapshotId={isLocal ? undefined : deployment.id}
			clientFilterRealSnapshotIds={
				isLocal ? new Set(realDeployments?.map((d) => d.id) ?? []) : undefined
			}
		/>
	);
}
