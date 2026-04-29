import { useQuery } from "@tanstack/react-query";
import { ExecutionContainer } from "@/modules/executions/feature/ExecutionContainer";
import { deploymentsQueries } from "../business-logic/deployments-queries";
import { useSelectedDeployment } from "../business-logic/use-selected-deployment";
import { isLocalDeployment } from "../domain/local-deployment";

export function DeploymentExecutionContainer() {
	const { flowId, selected } = useSelectedDeployment();
	const { data: realDeployments } = useQuery(deploymentsQueries.list(flowId));

	const isLocal = isLocalDeployment(selected);
	const versionParam: number | "local" = isLocal
		? "local"
		: selected.versionNumber;

	return (
		<ExecutionContainer
			versionParam={versionParam}
			serverFilterSnapshotId={isLocal ? undefined : selected.id}
			clientFilterRealSnapshotIds={
				isLocal ? new Set(realDeployments?.map((d) => d.id) ?? []) : undefined
			}
		/>
	);
}
