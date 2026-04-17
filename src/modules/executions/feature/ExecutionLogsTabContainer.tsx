import { ErrorBoundary } from "react-error-boundary";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { ErrorFallback } from "@/shared/ui/ErrorFallback";
import type { Execution } from "../domain/execution";
import { ExecutionLogsHeaderNav } from "../ui/ExecutionLogsHeaderNav";
import {
	ExecutionLogsScopeSidebar,
	type ExecutionLogsScope,
} from "../ui/ExecutionLogsScopeSidebar";
import { ExecutionLogsContainer } from "./ExecutionLogsContainer";

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

	const scopeSidebar = (
		<ExecutionLogsScopeSidebar
			executionIndex={execution.index}
			checkpoints={checkpoints.map((c) => ({ id: c.id, name: c.name }))}
			selectedScope={selectedScope}
			onSelectScope={onSelectScope}
		/>
	);

	const toolbarLeading = (
		<ExecutionLogsHeaderNav onBack={onBack} withTrailingSeparator />
	);

	return (
		<ErrorBoundary
			key={boundaryKey}
			fallbackRender={(props) => (
				<ErrorFallback {...props} title="Failed to load execution logs" />
			)}
		>
			<ExecutionLogsContainer
				execution={execution}
				selectedScope={selectedScope}
				scopeSidebar={scopeSidebar}
				toolbarLeading={toolbarLeading}
				onBack={onBack}
			/>
		</ErrorBoundary>
	);
}
