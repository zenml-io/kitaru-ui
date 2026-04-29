import { deploymentsQueries } from "@/modules/deployments/business-logic/deployments-queries";
import { resolveDefaultDeployment } from "@/modules/deployments/business-logic/resolve-deployment";
import { useSelectedDeployment } from "@/modules/deployments/business-logic/use-selected-deployment";
import {
	LOCAL_VERSION_ID,
	isLocalDeployment,
} from "@/modules/deployments/domain/local-deployment";
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
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";

type FlowExecutionsContainerProps = { scope: "version" | "all" };

export function FlowExecutionsContainer({
	scope,
}: FlowExecutionsContainerProps) {
	return scope === "version" ? (
		<VersionedFlowExecutionsContainer />
	) : (
		<AllFlowExecutionsContainer />
	);
}

function VersionedFlowExecutionsContainer() {
	const { flowId, selected } = useSelectedDeployment();
	const { data: realDeployments } = useQuery(deploymentsQueries.list(flowId));
	const [activeScope, setActiveScope] = useState<ExecutionsScope>("version");

	const isLocal = isLocalDeployment(selected);
	const shouldServerFilter =
		activeScope === "version" && !!selected && !isLocal;

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
			? selected.id === LOCAL_VERSION_ID
				? LOCAL_VERSION_ID
				: selected.versionNumber
			: undefined;

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
					realDeployments={realDeployments ?? []}
					versionParam={versionParam}
				/>
			</div>
		</>
	);
}

function AllFlowExecutionsContainer() {
	const { flowId } = useParams({
		from: "/_private/_navbar/flows/$flowId",
	});
	const [activeScope, setActiveScope] = useState<ExecutionsScope>("all");

	const { data: realDeployments } = useSuspenseQuery(
		deploymentsQueries.list(flowId)
	);

	const defaultDeployment =
		resolveDefaultDeployment(realDeployments) ?? realDeployments[0];
	const defaultIsLocal =
		defaultDeployment !== undefined && isLocalDeployment(defaultDeployment);
	const shouldServerFilter =
		activeScope === "version" && !!defaultDeployment && !defaultIsLocal;

	const { executionsData, refetch } = useExecutions(flowId, {
		snapshotId: shouldServerFilter ? defaultDeployment.id : undefined,
		refetchInterval: DEFAULT_EXECUTIONS_POLLING_INTERVAL,
	});
	const { refresh: refreshExecutions, isPending: isManualRefreshPending } =
		useManualRefresh(refetch);

	const kitaruSnapshotIds = new Set(realDeployments.map((d) => d.id));
	const displayedExecutions =
		activeScope === "version" && defaultIsLocal
			? filterLocalExecutions(executionsData, kitaruSnapshotIds)
			: executionsData;

	let versionLabel = "";
	if (defaultDeployment) {
		versionLabel = defaultIsLocal
			? "local"
			: `v${defaultDeployment.versionNumber}`;
	}

	const versionParam: number | typeof LOCAL_VERSION_ID | undefined =
		activeScope === "version" && defaultDeployment
			? defaultIsLocal
				? LOCAL_VERSION_ID
				: defaultDeployment.versionNumber
			: undefined;

	return (
		<>
			<TableToolbarRoot>
				<TableToolbarContent className="justify-between">
					{versionLabel ? (
						<ExecutionsScopeToggle
							versionLabel={versionLabel}
							scope={activeScope}
							onScopeChange={setActiveScope}
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
					realDeployments={realDeployments}
					versionParam={versionParam}
				/>
			</div>
		</>
	);
}
