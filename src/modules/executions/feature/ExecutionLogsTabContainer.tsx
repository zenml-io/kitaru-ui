import { ErrorBoundary } from "react-error-boundary";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { ErrorFallback } from "@/shared/ui/ErrorFallback";
import type { Execution } from "../domain/execution";
import { ExecutionLogsHeaderNav } from "../ui/ExecutionLogsHeaderNav";
import { ExecutionLogsContainer } from "./ExecutionLogsContainer";
import {
	ExecutionLogsScopeSidebarContainer,
	type ExecutionLogsScope,
} from "./ExecutionLogsScopeSidebarContainer";

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
		<ExecutionLogsScopeSidebarContainer
			executionIndex={execution.index}
			checkpoints={checkpoints}
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
