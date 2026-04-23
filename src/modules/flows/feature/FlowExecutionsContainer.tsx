import { useSelectedVersion } from "@/modules/deployments/business-logic/use-selected-version";
import { isLocalDeployment } from "@/modules/deployments/domain/local-deployment";
import { useExecutions } from "@/modules/executions/business-logic/use-executions";
import { DEFAULT_EXECUTIONS_POLLING_INTERVAL } from "@/modules/executions/domain/fetch-executions";
import { filterLocalExecutions } from "@/modules/executions/domain/filter-local-executions";
import { ExecutionsTableContainer } from "@/modules/executions/feature/ExecutionsTableContainer";
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
import { useNavigate, useSearch } from "@tanstack/react-router";

export function FlowExecutionsContainer() {
	const { flowId, realDeployments, selected } = useSelectedVersion();
	const { versions } = useSearch({
		from: "/_private/_navbar/flows/$flowId",
	});
	const navigate = useNavigate();
	const isLocal = isLocalDeployment(selected);
	const activeScope: ExecutionsScope = versions === "all" ? "all" : "version";
	const shouldServerFilter =
		activeScope === "version" && !!selected && !isLocal;

	const { executionsData, refetch } = useExecutions(flowId, {
		snapshotId: shouldServerFilter ? selected?.id : undefined,
		refetchInterval: DEFAULT_EXECUTIONS_POLLING_INTERVAL,
	});
	const { refresh: refreshExecutions, isPending: isManualRefreshPending } =
		useManualRefresh(refetch);

	const kitaruSnapshotIds = new Set(realDeployments.map((d) => d.id));
	const displayedExecutions =
		activeScope === "version" && isLocal
			? filterLocalExecutions(executionsData, kitaruSnapshotIds)
			: executionsData;

	let versionLabel = "";
	if (isLocal) versionLabel = "local";
	else if (selected) versionLabel = `v${selected.versionNumber}`;

	function handleScopeChange(nextScope: ExecutionsScope) {
		navigate({
			to: ".",
			search: (prev) => ({
				...prev,
				versions: nextScope === "all" ? "all" : undefined,
			}),
		});
	}

	return (
		<>
			<TableToolbarRoot>
				<TableToolbarContent className="justify-between">
					{selected && versionLabel ? (
						<ExecutionsScopeToggle
							versionLabel={versionLabel}
							scope={activeScope}
							onScopeChange={handleScopeChange}
						/>
					) : (
						<div />
					)}
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
				/>
			</div>
		</>
	);
}
