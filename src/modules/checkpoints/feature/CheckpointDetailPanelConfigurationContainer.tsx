import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useExecution } from "@/modules/executions/business-logic/use-execution";
import { ErrorFallback } from "@/shared/ui/ErrorFallback";
import { CheckpointDetailPanelConfigurationEmpty } from "../ui/CheckpointDetailPanelConfigurationEmpty";
import { CheckpointDetailPanelConfigurationSkeleton } from "../ui/CheckpointDetailPanelConfigurationSkeleton";
import { CheckpointStackSectionContainer } from "./CheckpointStackSectionContainer";

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
			<ErrorBoundary
				fallbackRender={(props) => (
					<ErrorFallback {...props} title="Failed to load configuration" />
				)}
			>
				<Suspense fallback={<CheckpointDetailPanelConfigurationSkeleton />}>
					{stackId ? (
						<CheckpointStackSectionContainer stackId={stackId} />
					) : null}
					{buildId ? <div data-testid="docker-section-placeholder" /> : null}
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
