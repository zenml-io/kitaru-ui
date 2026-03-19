import { useState, useRef } from "react";
import { useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useExecutions } from "../business-logic/use-executions";
import { useExecution } from "../business-logic/use-execution";
import { useWaitCondition } from "../business-logic/use-wait-condition";
import { useResolveWaitCondition } from "../business-logic/use-resolve-wait-condition";
import { executionsQueryKeys } from "../business-logic/executions-queries";
import { useCheckpoints } from "@/modules/checkpoints/business-logic/use-checkpoints";
import {
	ThreePanelLayout,
	type ThreePanelLayoutHandle,
} from "@/shared/ui/ThreePanelLayout";
import { ExecutionsList } from "../ui/ExecutionsList";
import { ExecutionDetails } from "../ui/ExecutionDetails";
import { CheckpointDetailPanelContainer } from "@/modules/checkpoints/feature/CheckpointDetailPanelContainer";
import { checkpointsQueryKeys } from "@/modules/checkpoints/business-logic/checkpoints-queries";
import { StatusDot } from "@/shared/ui/StatusDot";
import { CopyCommand } from "@/shared/ui/CopyCommand";

export function ExecutionContainer() {
	const { flowId, executionId } = useParams({
		from: "/_private/_navbar/flows/$flowId/executions/$executionId",
	});
	const { executionsData } = useExecutions(flowId);
	const { executionData } = useExecution(executionId);
	const { checkpointsData } = useCheckpoints(executionId);
	const { waitConditionData } = useWaitCondition(
		executionData?.activeWaitConditionEntry?.id
	);

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
					checkpoints={checkpointsData}
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
