import { deploymentsQueries } from "@/modules/deployments/business-logic/deployments-queries";
import { useSelectedDeployment } from "@/modules/deployments/business-logic/use-selected-deployment";
import {
	LOCAL_VERSION_ID,
	isLocalDeployment,
} from "@/modules/deployments/domain/local-deployment";
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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function DeploymentExecutionsListContainer() {
	const { flowId, selected } = useSelectedDeployment();
	const { data: realDeployments } = useQuery(deploymentsQueries.list(flowId));
	const [activeScope, setActiveScope] = useState<ExecutionsScope>("version");

	const isLocal = isLocalDeployment(selected);
	const shouldServerFilter = activeScope === "version" && !isLocal;

	const { executionsData, refetch } = useExecutions(flowId, {
		snapshotId: shouldServerFilter ? selected.id : undefined,
		refetchInterval: DEFAULT_EXECUTIONS_POLLING_INTERVAL,
	});
	const { refresh: refreshExecutions, isPending: isManualRefreshPending } =
		useManualRefresh(refetch);

	const kitaruSnapshotIds = new Set(realDeployments?.map((d) => d.id) ?? []);
	const displayedExecutions =
		activeScope === "version" && isLocal
			? filterLocalExecutions(executionsData, kitaruSnapshotIds)
			: executionsData;

	const versionLabel = isLocal ? "local" : `v${selected.versionNumber}`;

	const versionParam: number | typeof LOCAL_VERSION_ID | undefined =
		activeScope === "version"
			? isLocal
				? LOCAL_VERSION_ID
				: selected.versionNumber
			: undefined;

	const versionLookup: SnapshotVersionLookup = new Map(
		realDeployments?.map((d) => [
			d.id,
			isLocalDeployment(d) ? "local" : d.versionNumber,
		]) ?? []
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
