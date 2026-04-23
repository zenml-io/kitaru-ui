import { useSuspenseQuery } from "@tanstack/react-query";
import { deploymentsQueries } from "@/modules/deployments/business-logic/deployments-queries";
import { resolveSelectedDeployment } from "@/modules/deployments/business-logic/resolve-deployment";
import {
	isLocalDeployment,
	withLocalDeployment,
} from "@/modules/deployments/domain/local-deployment";
import { useExecutions } from "@/modules/executions/business-logic/use-executions";
import { filterLocalExecutions } from "@/modules/executions/domain/filter-local-executions";
import { ExecutionsTableContainer } from "@/modules/executions/feature/ExecutionsTableContainer";
import {
	type ExecutionsScope,
	ExecutionsScopeToggle,
} from "@/modules/executions/ui/ExecutionsScopeToggle";
import { flowsQueries } from "@/modules/flows/business-logic/flows-queries";
import { useManualRefresh } from "@/shared/business-logic/use-manual-refresh";
import { RefreshButton } from "@/shared/ui/RefreshButton";
import {
	TableToolbarContent,
	TableToolbarRoot,
} from "@/shared/ui/TableToolbar";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { DEFAULT_EXECUTIONS_POLLING_INTERVAL } from "@/modules/executions/domain/fetch-executions";

export function FlowExecutionsContainer() {
	const { flowId } = useParams({
		from: "/_private/_navbar/flows/$flowId/$tab",
	});
	const { version, versions } = useSearch({
		from: "/_private/_navbar/flows/$flowId",
	});
	const navigate = useNavigate();
	const { data: flow } = useSuspenseQuery(flowsQueries.detail(flowId));
	const { data: realDeployments } = useSuspenseQuery(
		deploymentsQueries.list(flowId)
	);
	const deployments = withLocalDeployment(realDeployments, flowId, flow.name);
	const selected = resolveSelectedDeployment(deployments, version);
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
