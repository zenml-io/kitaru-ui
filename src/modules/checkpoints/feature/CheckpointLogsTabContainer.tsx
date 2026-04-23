import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import { LogsListSkeleton } from "@/modules/logs/ui/LogsListSkeleton";
import { ErrorFallback } from "@/shared/ui/ErrorFallback";
import { CheckpointLogsContainer } from "./CheckpointLogsContainer";

type CheckpointLogsTabContainerProps = {
	checkpointId: string;
	logSources: string[];
	checkpointStatus?: ExecutionStatus;
};

export function CheckpointLogsTabContainer({
	checkpointId,
	logSources,
	checkpointStatus,
}: CheckpointLogsTabContainerProps) {
	return (
		<ErrorBoundary
			key={checkpointId}
			fallbackRender={(props) => (
				<ErrorFallback {...props} title="Failed to load logs" />
			)}
		>
			<Suspense fallback={<LogsListSkeleton />}>
				<CheckpointLogsContainer
					checkpointId={checkpointId}
					logSources={logSources}
					checkpointStatus={checkpointStatus}
				/>
			</Suspense>
		</ErrorBoundary>
	);
}
