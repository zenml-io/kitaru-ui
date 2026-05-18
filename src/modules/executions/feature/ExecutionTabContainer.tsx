import { checkpointsQueryKeys } from "@/modules/checkpoints/business-logic/checkpoints-queries";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { CopyCommand } from "@/shared/ui/CopyCommand";
import { StatusDot } from "@/shared/ui/StatusDot";
import { useThreePanelLayout } from "@/shared/ui/ThreePanelLayoutContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { executionsQueryKeys } from "../business-logic/executions-queries";
import { useResolveWaitCondition } from "../business-logic/use-resolve-wait-condition";
import { useTimelineEntries } from "../business-logic/use-timeline-entries";
import { useWaitCondition } from "../business-logic/use-wait-condition";
import type { Execution } from "../domain/execution";
import { ExecutionDetails } from "../ui/ExecutionDetails";

type ExecutionTabContainerProps = {
	executionId: string;
	flowId: string;
	execution: Execution;
	checkpoints: CheckpointEntry[];
	selectedCheckpointId: string | undefined;
	onSelectCheckpoint: (id: string) => void;
};

export function ExecutionTabContainer({
	executionId,
	flowId,
	execution,
	checkpoints,
	selectedCheckpointId,
	onSelectCheckpoint,
}: ExecutionTabContainerProps) {
	const { expandRight } = useThreePanelLayout();

	const { waitConditionData } = useWaitCondition(
		execution.activeWaitConditionEntry?.id
	);
	const { timelineEntries } = useTimelineEntries(executionId, checkpoints);

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

	const shouldShowResumeHint =
		execution.status === "paused" && !execution.activeWaitConditionEntry;

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
		<ExecutionDetails
			key={executionId}
			timelineEntries={timelineEntries}
			selectedCheckpointId={selectedCheckpointId}
			onSelectCheckpoint={(id) => {
				onSelectCheckpoint(id);
				expandRight();
			}}
			waitCondition={waitConditionData}
			onResolveWaitCondition={resolveWaitCondition}
			resumeHint={resumeHint}
		/>
	);
}
