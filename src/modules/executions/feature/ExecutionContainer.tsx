import {
	getCheckpointsPollingInterval,
	useCheckpoints,
} from "@/modules/checkpoints/business-logic/use-checkpoints";
import { CheckpointDetailPanelContainer } from "@/modules/checkpoints/feature/CheckpointDetailPanelContainer";
import type { PanelTab } from "@/modules/checkpoints/ui/CheckpointDetailPanelTabs";
import { useSelectedVersion } from "@/modules/deployments/business-logic/use-selected-version";
import { isLocalDeployment } from "@/modules/deployments/domain/local-deployment";
import { useManualRefresh } from "@/shared/business-logic/use-manual-refresh";
import { RefreshButton } from "@/shared/ui/RefreshButton";
import { ThreePanelLayout } from "@/shared/ui/ThreePanelLayout";
import { ThreePanelLayoutProvider } from "@/shared/ui/ThreePanelLayoutContext";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useExecution } from "../business-logic/use-execution";
import { useExecutions } from "../business-logic/use-executions";
import { useSyncExecutionStatus } from "../business-logic/use-sync-execution-status";
import { DEFAULT_EXECUTIONS_POLLING_INTERVAL } from "../domain/fetch-executions";
import { filterLocalExecutions } from "../domain/filter-local-executions";
import { ExecutionActionsDropdown } from "../ui/ExecutionActionsDropdown";
import type { ExecutionLogsScope } from "./ExecutionLogsScopeSidebarContainer";
import { ExecutionsList } from "../ui/ExecutionsList";
import { ExecutionTabs, type ExecutionTab } from "../ui/ExecutionTabs";
import { ExecutionLogsTabContainer } from "./ExecutionLogsTabContainer";
import { ExecutionTabContainer } from "./ExecutionTabContainer";

const ROUTE_ID = "/_private/_navbar/flows/$flowId/executions/$executionId";
const ROUTE_PATH = "/flows/$flowId/executions/$executionId";

export function ExecutionContainer() {
	return (
		<ThreePanelLayoutProvider>
			<ExecutionContainerBody />
		</ThreePanelLayoutProvider>
	);
}

function ExecutionContainerBody() {
	const { executionId } = useParams({ from: ROUTE_ID });
	const { flowId, realDeployments, selected } = useSelectedVersion();
	const { versions } = useSearch({ from: "/_private/_navbar/flows/$flowId" });
	const search = useSearch({ from: ROUTE_ID });
	const navigate = useNavigate({ from: ROUTE_PATH });

	const isLocal = isLocalDeployment(selected);
	const activeScope = versions === "all" ? "all" : "version";
	const shouldServerFilter =
		activeScope === "version" && !!selected && !isLocal;

	const activeTab: ExecutionTab = search.tab === "logs" ? "logs" : "execution";
	const isLogsTab = activeTab === "logs";

	const setActiveTab = (tab: ExecutionTab) => {
		navigate({
			search: () => (tab === "logs" ? { tab: "logs" } : {}),
			replace: true,
		});
	};

	const selectedScope: ExecutionLogsScope = search.scope
		? { kind: "checkpoint", checkpointId: search.scope }
		: { kind: "root" };

	const setSelectedScope = (scope: ExecutionLogsScope) => {
		navigate({
			search: () =>
				scope.kind === "root"
					? { tab: "logs" }
					: { tab: "logs", scope: scope.checkpointId },
			replace: true,
		});
	};

	const { executionsData, refetch: refetchExecutions } = useExecutions(flowId, {
		snapshotId: shouldServerFilter ? selected?.id : undefined,
		refetchInterval: DEFAULT_EXECUTIONS_POLLING_INTERVAL,
	});
	const { executionData, refetch: refetchExecution } =
		useExecution(executionId);
	const { checkpointsData, refetch: refetchCheckpoints } = useCheckpoints(
		executionId,
		{
			refetchInterval: getCheckpointsPollingInterval,
		}
	);

	useSyncExecutionStatus(
		checkpointsData.executionStatus,
		checkpointsData.hasPendingWaitConditionNode
	);

	const { refresh: refreshExecutionData, isPending: isManualRefreshPending } =
		useManualRefresh(async () => {
			await Promise.all([
				refetchExecutions(),
				refetchExecution(),
				refetchCheckpoints(),
			]);
		});

	const [selectedCheckpointId, setSelectedCheckpointId] = useState<
		string | undefined
	>();
	const [activeCheckpointTab, setActiveCheckpointTab] =
		useState<PanelTab>("logs");

	const kitaruSnapshotIds = new Set(realDeployments.map((d) => d.id));
	const displayedExecutions =
		activeScope === "version" && isLocal
			? filterLocalExecutions(executionsData, kitaruSnapshotIds)
			: executionsData;

	const executionsSortedByCreatedAtDesc = [...displayedExecutions].sort(
		(a, b) => {
			return (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0);
		}
	);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="border-border bg-secondary flex shrink-0 items-center justify-between border-b px-5 py-2.5">
				<ExecutionTabs activeTab={activeTab} onTabChange={setActiveTab} />
				<div className="flex items-center gap-3">
					<RefreshButton
						size="sm"
						variant="outline"
						onClick={refreshExecutionData}
						isLoading={isManualRefreshPending}
					/>
					<ExecutionActionsDropdown executionId={executionId} flowId={flowId} />
				</div>
			</div>
			<ThreePanelLayout
				left={
					<ExecutionsList
						executions={executionsSortedByCreatedAtDesc}
						flowId={flowId}
						activeexecutionId={executionId}
					/>
				}
				center={
					isLogsTab ? (
						<ExecutionLogsTabContainer
							execution={executionData}
							checkpoints={checkpointsData.checkpoints}
							selectedScope={selectedScope}
							onSelectScope={setSelectedScope}
							onBack={() => setActiveTab("execution")}
						/>
					) : (
						<ExecutionTabContainer
							executionId={executionId}
							flowId={flowId}
							execution={executionData}
							checkpoints={checkpointsData.checkpoints}
							onSelectCheckpoint={setSelectedCheckpointId}
						/>
					)
				}
				right={
					isLogsTab ? null : (
						<CheckpointDetailPanelContainer
							key={selectedCheckpointId}
							checkpointId={selectedCheckpointId}
							activeTab={activeCheckpointTab}
							onTabChange={setActiveCheckpointTab}
						/>
					)
				}
			/>
		</div>
	);
}
