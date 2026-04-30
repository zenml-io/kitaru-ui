import { useCurrentDeployment } from "@/modules/deployments/business-logic/use-current-deployment";
import { useDeployments } from "@/modules/deployments/business-logic/use-deployments";
import { executionsFilter } from "@/modules/deployments/business-logic/version-execution-filter";
import {
	formatVersion,
	type DeploymentVersion,
} from "@/modules/deployments/domain/deployment";
import { useExecutions } from "@/modules/executions/business-logic/use-executions";
import { DEFAULT_EXECUTIONS_POLLING_INTERVAL } from "@/modules/executions/domain/fetch-executions";
import { filterLocalExecutions } from "@/modules/executions/domain/filter-local-executions";
import {
	ExecutionsTableContainer,
	type SnapshotVersionLookup,
} from "@/modules/executions/feature/ExecutionsTableContainer";
import {
	type ExecutionsScope,
	ExecutionsScopeToggle,
} from "@/modules/executions/ui/ExecutionsScopeToggle";
import { useManualRefresh } from "@/shared/business-logic/use-manual-refresh";
import { RefreshButton } from "@/shared/ui/RefreshButton";
import {
	TableToolbarContent,
	TableToolbarRoot,
} from "@/shared/ui/TableToolbar";
import { useState } from "react";

export function DeploymentExecutionsListContainer() {
	const { flowId, deployment } = useCurrentDeployment();
	const { data: realDeployments } = useDeployments(flowId);
	const [activeScope, setActiveScope] = useState<ExecutionsScope>("version");

	const filter = executionsFilter(activeScope, deployment, realDeployments);

	const { executionsData, refetch } = useExecutions(flowId, {
		snapshotId: filter.serverFilterSnapshotId,
		refetchInterval: DEFAULT_EXECUTIONS_POLLING_INTERVAL,
	});
	const { refresh: refreshExecutions, isPending: isManualRefreshPending } =
		useManualRefresh(refetch);

	const displayedExecutions = filter.clientFilterRealSnapshotIds
		? filterLocalExecutions(executionsData, filter.clientFilterRealSnapshotIds)
		: executionsData;

	const versionLabel = formatVersion(deployment.version);

	const versionParam: DeploymentVersion | undefined =
		activeScope === "version" ? deployment.version : undefined;

	const versionLookup: SnapshotVersionLookup = new Map(
		realDeployments.map((d) => [d.id, d.version])
	);

	return (
		<>
			<TableToolbarRoot>
				<TableToolbarContent className="justify-between">
					<ExecutionsScopeToggle
						versionLabel={versionLabel}
						scope={activeScope}
						onScopeChange={setActiveScope}
					/>
					<RefreshButton
						variant="outline"
						isLoading={isManualRefreshPending}
						onClick={refreshExecutions}
					/>
				</TableToolbarContent>
			</TableToolbarRoot>
			<div className="container mx-auto flex w-full flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
				<ExecutionsTableContainer
					executionRows={displayedExecutions}
					flowId={flowId}
					versionLookup={versionLookup}
					versionParam={versionParam}
				/>
			</div>
		</>
	);
}
