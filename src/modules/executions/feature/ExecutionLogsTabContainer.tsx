import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { ErrorFallback } from "@/shared/ui/ErrorFallback";
import type { Execution } from "../domain/execution";
import type { ExecutionLogsScope } from "../ui/ExecutionLogsScopeSidebar";
import { ExecutionLogsContainer } from "./ExecutionLogsContainer";
import { LogsLoadingShell } from "./LogsLoadingShell";

type ExecutionLogsTabContainerProps = {
	execution: Execution;
	checkpoints: CheckpointEntry[];
	selectedScope: ExecutionLogsScope;
	onSelectScope: (scope: ExecutionLogsScope) => void;
	onBack: () => void;
};

export function ExecutionLogsTabContainer({
	execution,
	checkpoints,
	selectedScope,
	onSelectScope,
	onBack,
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
			<Suspense
				fallback={
					<LogsLoadingShell
						executionIndex={execution.index}
						checkpoints={checkpoints}
						selectedScope={selectedScope}
						onSelectScope={onSelectScope}
						onBack={onBack}
					/>
				}
			>
				<ExecutionLogsContainer
					execution={execution}
					checkpoints={checkpoints}
					selectedScope={selectedScope}
					onSelectScope={onSelectScope}
					onBack={onBack}
				/>
			</Suspense>
		</ErrorBoundary>
	);
}
