import { Suspense } from "react";
import { useExecution } from "@/modules/executions/business-logic/use-execution";
import { CheckpointDetailPanelConfigurationEmpty } from "../ui/CheckpointDetailPanelConfigurationEmpty";
import { CheckpointDetailPanelConfigurationSkeleton } from "../ui/CheckpointDetailPanelConfigurationSkeleton";

type Props = {
	executionId: string;
	checkpointName: string;
	checkpointStepOperator?: string;
};

export function CheckpointDetailPanelConfigurationContainer({
	executionId,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- wired in Task 9 (Stack section) / Task 10 (Docker)
	checkpointName: _checkpointName,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- wired in Task 10 (Docker)
	checkpointStepOperator: _checkpointStepOperator,
}: Props) {
	const { executionData } = useExecution(executionId);
	const { stackId, buildId } = executionData;

	if (!stackId && !buildId) {
		return <CheckpointDetailPanelConfigurationEmpty />;
	}

	return (
		<div className="flex flex-col">
			<Suspense fallback={<CheckpointDetailPanelConfigurationSkeleton />}>
				{/* Stack and DockerImage section containers will be inserted in later tasks. */}
				{stackId ? <div data-testid="stack-section-placeholder" /> : null}
				{buildId ? <div data-testid="docker-section-placeholder" /> : null}
			</Suspense>
		</div>
	);
}
