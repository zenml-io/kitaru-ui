import { useState, useRef } from "react";
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
import { CheckpointDetailPanelContainer } from "@/modules/checkpoints/feature/CheckpointDetailPanelContainer";

export function ExecutionContainer() {
	const { flowId, executionId } = useParams({
		from: "/_private/_navbar/flows/$flowId/executions/$executionId",
	});
	const { executionsData } = useExecutions(flowId);
	const { executionData } = useExecution(executionId);
	const { checkpointsData } = useCheckpoints(executionId);

	const [selectedCheckpointId, setSelectedCheckpointId] = useState<
		string | undefined
	>();
	const layoutRef = useRef<ThreePanelLayoutHandle>(null);

	const executionsSortedByCreatedAtDesc = [...executionsData].sort((a, b) => {
		return (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0);
	});

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
