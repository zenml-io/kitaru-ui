import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useExecution } from "@/modules/executions/business-logic/use-execution";
import { ErrorFallback } from "@/shared/ui/ErrorFallback";
import { CheckpointDetailPanelConfigurationEmpty } from "../ui/CheckpointDetailPanelConfigurationEmpty";
import { CheckpointDetailPanelConfigurationSkeleton } from "../ui/CheckpointDetailPanelConfigurationSkeleton";
import { CheckpointDockerImageSectionContainer } from "./CheckpointDockerImageSectionContainer";
import { CheckpointStackSectionContainer } from "./CheckpointStackSectionContainer";

type Props = {
	executionId: string;
	checkpointName: string;
	checkpointStepOperator?: string;
};

export function CheckpointDetailPanelConfigurationContainer({
	executionId,
	checkpointName,
	checkpointStepOperator,
}: Props) {
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
						<CheckpointStackSectionContainer stackId={stackId} />
					) : null}
					{buildId ? (
						<CheckpointDockerImageSectionContainer
							buildId={buildId}
							checkpointName={checkpointName}
							checkpointStepOperator={checkpointStepOperator}
						/>
					) : null}
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
