import { useCheckpoints } from "@/modules/checkpoints/business-logic/use-checkpoints";
import { CheckpointDetailPanelContainer } from "@/modules/checkpoints/feature/CheckpointDetailPanelContainer";
import { RefreshButton } from "@/shared/ui/RefreshButton";
import {
	ThreePanelLayout,
	type ThreePanelLayoutHandle,
} from "@/shared/ui/ThreePanelLayout";
import { useParams } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useExecution } from "../business-logic/use-execution";
import { useExecutions } from "../business-logic/use-executions";
import { ExecutionDetails } from "../ui/ExecutionDetails";
import { ExecutionsList } from "../ui/ExecutionsList";

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

	const [selectedCheckpointId, setSelectedCheckpointId] = useState<
		string | undefined
	>();
	const layoutRef = useRef<ThreePanelLayoutHandle>(null);

	const selectedCheckpoint = checkpointsData.nodes.find(
		(c) => c.id === selectedCheckpointId
	);

	function handleRefresh() {
		refetchExecutions();
		refetchExecution();
		refetchCheckpoints();
	}

	const isRefreshing =
		isRefetchingExecutions || isRefetchingExecution || isRefetchingCheckpoints;

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
					executions={executionsData}
					flowId={flowId}
					activeexecutionId={executionId}
				/>
			}
			center={
				<ExecutionDetails
					execution={executionData}
					checkpoints={checkpointsData.nodes}
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
					checkpoint={selectedCheckpoint}
				/>
			}
		/>
	);
}
