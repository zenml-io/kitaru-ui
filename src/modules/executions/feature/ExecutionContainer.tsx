import { checkpointsQueryKeys } from "@/modules/checkpoints/business-logic/checkpoints-queries";
import { useCheckpoints } from "@/modules/checkpoints/business-logic/use-checkpoints";
import { CheckpointDetailPanelContainer } from "@/modules/checkpoints/feature/CheckpointDetailPanelContainer";
import { CopyCommand } from "@/shared/ui/CopyCommand";
import { RefreshButton } from "@/shared/ui/RefreshButton";
import { StatusDot } from "@/shared/ui/StatusDot";
import {
	ThreePanelLayout,
	type ThreePanelLayoutHandle,
} from "@/shared/ui/ThreePanelLayout";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { executionsQueryKeys } from "../business-logic/executions-queries";
import { useExecution } from "../business-logic/use-execution";
import { useExecutions } from "../business-logic/use-executions";
import { useResolveWaitCondition } from "../business-logic/use-resolve-wait-condition";
import { useWaitCondition } from "../business-logic/use-wait-condition";
import { ExecutionDetails } from "../ui/ExecutionDetails";
import { ExecutionsList } from "../ui/ExecutionsList";
import { useSyncExecutionStatus } from "../business-logic/use-sync-execution-status";

export function ExecutionContainer() {
	const { flowId, executionId } = useParams({
		from: "/_private/_navbar/flows/$flowId/executions/$executionId",
	});
	const {
		executionsData,
		refetch: refetchExecutions,
		isRefetching: isRefetchingExecutions,
	} = useExecutions(flowId);
	const {
		executionData,
		refetch: refetchExecution,
		isRefetching: isRefetchingExecution,
	} = useExecution(executionId);
	const {
		checkpointsData,
		refetch: refetchCheckpoints,
		isRefetching: isRefetchingCheckpoints,
	} = useCheckpoints(executionId);
	const { waitConditionData } = useWaitCondition(
		executionData?.activeWaitConditionEntry?.id
	);

	useSyncExecutionStatus(executionData.status);

	const queryClient = useQueryClient();
	const { resolveWaitCondition } = useResolveWaitCondition({
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: executionsQueryKeys.all(flowId),
			});
			queryClient.invalidateQueries({
				queryKey: executionsQueryKeys.detail(executionId),
			});
			queryClient.invalidateQueries({
				queryKey: checkpointsQueryKeys.all(executionId),
			});
		},
	});

	function handleRefresh() {
		refetchExecutions();
		refetchExecution();
		refetchCheckpoints();
	}

	const isRefreshing =
		isRefetchingExecutions || isRefetchingExecution || isRefetchingCheckpoints;

	const [selectedCheckpointId, setSelectedCheckpointId] = useState<
		string | undefined
	>();
	const layoutRef = useRef<ThreePanelLayoutHandle>(null);

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

	return (
		<ThreePanelLayout
			centerHeader={
				<div className="mr-2 flex flex-1 items-center justify-end">
					<RefreshButton
						size="sm"
						variant="outline"
						onClick={handleRefresh}
						isLoading={isRefreshing}
					/>
				</div>
			}
			ref={layoutRef}
			left={
				<ExecutionsList
					executions={executionsSortedByCreatedAtDesc}
					flowId={flowId}
					activeexecutionId={executionId}
				/>
			}
			center={
				<ExecutionDetails
					execution={executionData}
					checkpoints={checkpointsData.checkpoints}
					selectedCheckpointId={selectedCheckpointId}
					onSelectCheckpoint={(id) => {
						setSelectedCheckpointId(id);
						layoutRef.current?.expandRight();
					}}
					waitCondition={waitConditionData}
					onResolveWaitCondition={resolveWaitCondition}
					resumeHint={resumeHint}
				/>
			}
			right={
				<CheckpointDetailPanelContainer
					key={selectedCheckpointId}
					checkpointId={selectedCheckpointId}
				/>
			}
		/>
	);
}
