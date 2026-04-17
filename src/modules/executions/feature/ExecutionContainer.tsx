import { checkpointsQueryKeys } from "@/modules/checkpoints/business-logic/checkpoints-queries";
import {
	getCheckpointsPollingInterval,
	useCheckpoints,
} from "@/modules/checkpoints/business-logic/use-checkpoints";
import { useTimelineEntries } from "../business-logic/use-timeline-entries";
import { CheckpointDetailPanelContainer } from "@/modules/checkpoints/feature/CheckpointDetailPanelContainer";
import { useManualRefresh } from "@/shared/business-logic/use-manual-refresh";
import { CopyCommand } from "@/shared/ui/CopyCommand";
import { RefreshButton } from "@/shared/ui/RefreshButton";
import { StatusDot } from "@/shared/ui/StatusDot";
import { ThreePanelLayout } from "@/shared/ui/ThreePanelLayout";
import {
	ThreePanelLayoutProvider,
	useThreePanelLayout,
} from "@/shared/ui/ThreePanelLayoutContext";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { executionsQueryKeys } from "../business-logic/executions-queries";
import { useExecution } from "../business-logic/use-execution";
import { useExecutions } from "../business-logic/use-executions";
import { useResolveWaitCondition } from "../business-logic/use-resolve-wait-condition";
import { useSyncExecutionStatus } from "../business-logic/use-sync-execution-status";
import { useWaitCondition } from "../business-logic/use-wait-condition";
import { DEFAULT_EXECUTIONS_POLLING_INTERVAL } from "../domain/fetch-executions";
import { ExecutionActionsDropdown } from "../ui/ExecutionActionsDropdown";
import { ExecutionDetails } from "../ui/ExecutionDetails";
import type { ExecutionLogsScope } from "../ui/ExecutionLogsScopeSidebar";
import { ExecutionsList } from "../ui/ExecutionsList";
import { ExecutionTabs, type ExecutionTab } from "../ui/ExecutionTabs";
import { ExecutionLogsTabContainer } from "./ExecutionLogsTabContainer";

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
	const { flowId, executionId } = useParams({ from: ROUTE_ID });
	const search = useSearch({ from: ROUTE_ID });
	const navigate = useNavigate({ from: ROUTE_PATH });

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
	const { waitConditionData } = useWaitCondition(
		executionData?.activeWaitConditionEntry?.id
	);

	const { timelineEntries } = useTimelineEntries(
		executionId,
		checkpointsData.checkpoints
	);

	useSyncExecutionStatus(
		checkpointsData.executionStatus,
		checkpointsData.hasPendingWaitConditionNode
	);

	const queryClient = useQueryClient();
	function invalidateExecutionQueries() {
		queryClient.invalidateQueries({
			queryKey: executionsQueryKeys.all(flowId),
		});
		queryClient.invalidateQueries({
			queryKey: executionsQueryKeys.detail(executionId),
		});
		queryClient.invalidateQueries({
			queryKey: executionsQueryKeys.waitConditions(executionId),
		});
		queryClient.invalidateQueries({
			queryKey: checkpointsQueryKeys.all(executionId),
		});
	}

	const { resolveWaitCondition } = useResolveWaitCondition({
		onSuccess: invalidateExecutionQueries,
		onError: () => {
			invalidateExecutionQueries();
			toast.error("Failed to resolve wait condition");
		},
	});

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
	const { expandRight } = useThreePanelLayout();

	const executionsSortedByCreatedAtDesc = [...executionsData].sort((a, b) => {
		return (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0);
	});

	const shouldShowResumeHint =
		executionData?.status === "paused" &&
		!executionData?.activeWaitConditionEntry;

	const resumeHint = shouldShowResumeHint ? (
		<div className="bg-card flex flex-col">
			<div className="flex shrink-0 flex-col gap-4 px-4 py-4">
				<div className="flex items-center gap-2">
					<StatusDot status="paused" />
					<span className="text-foreground truncate font-mono text-xs font-semibold">
						Execution paused
					</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-muted-foreground text-xs">
						Resume by running this command in your Kitaru CLI:
					</span>
					<CopyCommand
						code={`kitaru executions resume --exec-id ${executionId}`}
					/>
				</div>
			</div>
		</div>
	) : null;

	const centerBody = isLogsTab ? (
		<ExecutionLogsTabContainer
			execution={executionData}
			checkpoints={checkpointsData.checkpoints}
			selectedScope={selectedScope}
			onSelectScope={setSelectedScope}
			onBack={() => setActiveTab("execution")}
		/>
	) : (
		<ExecutionDetails
			key={executionId}
			execution={executionData}
			timelineEntries={timelineEntries}
			onSelectCheckpoint={(id) => {
				setSelectedCheckpointId(id);
				expandRight();
			}}
			waitCondition={waitConditionData}
			onResolveWaitCondition={resolveWaitCondition}
			resumeHint={resumeHint}
		/>
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
				center={centerBody}
				right={
					isLogsTab ? null : (
						<CheckpointDetailPanelContainer
							key={selectedCheckpointId}
							checkpointId={selectedCheckpointId}
						/>
					)
				}
				hideRight={isLogsTab}
				hideCenterHeader={isLogsTab}
			/>
		</div>
	);
}
