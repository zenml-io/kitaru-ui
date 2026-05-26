import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import { Button } from "@zenml/hashi/primitives/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@zenml/hashi/primitives/tooltip";
import { Play } from "lucide-react";
import { ReplayExecutionSheetContainer } from "./ReplayExecutionSheetContainer";

type ReplayFromCheckpointContainerProps = {
	executionStatus?: ExecutionStatus;
	executionNumber: string;
	executionId: string;
	checkpointsToSkip: string[];
	onReplaySuccess?: () => void;
};

export function ReplayFromCheckpointContainer({
	executionStatus,
	executionNumber,
	executionId,
	checkpointsToSkip,
	onReplaySuccess,
}: ReplayFromCheckpointContainerProps) {
	return (
		<Tooltip>
			<ReplayExecutionSheetContainer
				executionStatus={executionStatus}
				executionNumber={executionNumber}
				executionId={executionId}
				checkpointsToSkip={checkpointsToSkip}
				onReplaySuccess={onReplaySuccess}
				trigger={
					<TooltipTrigger
						render={
							<Button variant="outline" size="icon-xs" type="button">
								<Play className="size-3.5" />
								<span className="sr-only">Replay from this checkpoint</span>
							</Button>
						}
					/>
				}
			/>
			<TooltipContent>Replay from this checkpoint</TooltipContent>
		</Tooltip>
	);
}
