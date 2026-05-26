import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useExecution } from "@/modules/executions/business-logic/use-execution";
import { ErrorFallback } from "@/shared/ui/ErrorFallback";
import { CheckpointDetailPanelConfigurationEmpty } from "../ui/CheckpointDetailPanelConfigurationEmpty";
import { CheckpointDetailPanelConfigurationSkeleton } from "../ui/CheckpointDetailPanelConfigurationSkeleton";
import { CheckpointDockerImageSectionContainer } from "./CheckpointDockerImageSectionContainer";
import { CheckpointStackSectionContainer } from "./CheckpointStackSectionContainer";

type CheckpointDetailPanelConfigurationContainerProps = {
	executionId: string;
	checkpointName: string;
	checkpointStepOperator?: boolean | string;
	checkpointExperimentTracker?: boolean | string;
};

export function CheckpointDetailPanelConfigurationContainer({
	executionId,
	checkpointName,
	checkpointStepOperator,
	checkpointExperimentTracker,
}: CheckpointDetailPanelConfigurationContainerProps) {
	const { executionData } = useExecution(executionId);
	const { stackId, buildId } = executionData;

	if (!stackId && !buildId) {
		return <CheckpointDetailPanelConfigurationEmpty />;
	}

	return (
		<div className="flex flex-col">
			<ErrorBoundary
				fallbackRender={(props) => (
					<ErrorFallback {...props} title="Failed to load configuration" />
				)}
			>
				<Suspense fallback={<CheckpointDetailPanelConfigurationSkeleton />}>
					{stackId ? (
						<CheckpointStackSectionContainer
							stackId={stackId}
							checkpointStepOperator={checkpointStepOperator}
							checkpointExperimentTracker={checkpointExperimentTracker}
						/>
					) : null}
					{buildId ? (
						<CheckpointDockerImageSectionContainer
							buildId={buildId}
							checkpointName={checkpointName}
							checkpointStepOperator={checkpointStepOperator}
							stackId={stackId}
						/>
					) : null}
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
