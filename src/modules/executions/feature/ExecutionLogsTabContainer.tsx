import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { LogsListSkeleton } from "@/modules/logs/ui/LogsListSkeleton";
import { ErrorFallback } from "@/shared/ui/ErrorFallback";
import type { Execution } from "../domain/execution";
import type { ExecutionLogsScope } from "../ui/ExecutionLogsScopeSidebar";
import { ExecutionLogsContainer } from "./ExecutionLogsContainer";

type ExecutionLogsTabContainerProps = {
	execution: Execution;
	checkpoints: CheckpointEntry[];
	selectedScope: ExecutionLogsScope;
	onSelectScope: (scope: ExecutionLogsScope) => void;
};

export function ExecutionLogsTabContainer({
	execution,
	checkpoints,
	selectedScope,
	onSelectScope,
}: ExecutionLogsTabContainerProps) {
	const boundaryKey =
		selectedScope.kind === "checkpoint"
			? `checkpoint:${selectedScope.checkpointId}`
			: `execution:${execution.id}`;

	return (
		<ErrorBoundary
			key={boundaryKey}
			fallbackRender={(props) => (
				<ErrorFallback {...props} title="Failed to load execution logs" />
			)}
		>
			<Suspense fallback={<LogsListSkeleton />}>
				<ExecutionLogsContainer
					execution={execution}
					checkpoints={checkpoints}
					selectedScope={selectedScope}
					onSelectScope={onSelectScope}
				/>
			</Suspense>
		</ErrorBoundary>
	);
}
