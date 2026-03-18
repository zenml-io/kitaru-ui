import { useState, useRef, Suspense } from "react";
import { useParams } from "@tanstack/react-router";
import { useExecutions } from "../business-logic/use-executions";
import { useExecution } from "../business-logic/use-execution";
import { useCheckpoints } from "@/modules/checkpoints/business-logic/use-checkpoints";
import {
	ThreePanelLayout,
	type ThreePanelLayoutHandle,
} from "@/shared/ui/ThreePanelLayout";
import { ExecutionsList } from "../ui/ExecutionsList";
import { ExecutionDetails } from "../ui/ExecutionDetails";
import { CheckpointDetailPanel } from "@/modules/checkpoints/ui/CheckpointDetailPanel";

export function ExecutionContainer() {
	const { flowId, executionId } = useParams({
		from: "/_private/_navbar/flows/$flowId/executions/$executionId/",
	});
	const { executionsData } = useExecutions(flowId);
	const { executionData } = useExecution(executionId);
	const { checkpointsData } = useCheckpoints(executionId);

	const [selectedCheckpointId, setSelectedCheckpointId] = useState<
		string | undefined
	>();
	const layoutRef = useRef<ThreePanelLayoutHandle>(null);

	const selectedCheckpoint = checkpointsData?.find(
		(c) => c.id === selectedCheckpointId
	);

	return (
		<ThreePanelLayout
			ref={layoutRef}
			left={
				<ExecutionsList
					executions={executionsData}
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
				/>
			}
			right={
				<div className="flex h-full flex-col">
					<div className="text-muted-foreground px-3 py-2 text-xs font-semibold">
						Details
					</div>
					<div className="min-h-0 flex-1 overflow-y-auto">
						<Suspense>
							<CheckpointDetailPanel checkpoint={selectedCheckpoint} />
						</Suspense>
					</div>
				</div>
			}
		/>
	);
}
