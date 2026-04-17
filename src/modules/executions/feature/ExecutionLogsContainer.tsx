import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import type { Execution } from "../domain/execution";
import { ExecutionLogsEmptyState } from "../ui/ExecutionLogsEmptyState";
import { ExecutionLogsHeaderNav } from "../ui/ExecutionLogsHeaderNav";
import {
	ExecutionLogsScopeSidebar,
	type ExecutionLogsScope,
} from "../ui/ExecutionLogsScopeSidebar";
import { ExecutionCheckpointScopeContainer } from "./ExecutionCheckpointScopeContainer";
import { ExecutionRunLogsContainer } from "./ExecutionRunLogsContainer";

type ExecutionLogsContainerProps = {
	execution: Execution;
	checkpoints: CheckpointEntry[];
	selectedScope: ExecutionLogsScope;
	onSelectScope: (scope: ExecutionLogsScope) => void;
	onBack: () => void;
};

export function ExecutionLogsContainer({
	execution,
	checkpoints,
	selectedScope,
	onSelectScope,
	onBack,
}: ExecutionLogsContainerProps) {
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

	if (selectedScope.kind === "checkpoint") {
		return (
			<ExecutionCheckpointScopeContainer
				key={selectedScope.checkpointId}
				checkpointId={selectedScope.checkpointId}
				scopeSidebar={scopeSidebar}
				toolbarLeading={toolbarLeading}
			/>
		);
	}

	const [rootSource] = execution.logSources;

	if (!rootSource) {
		return (
			<ExecutionLogsEmptyState
				message="No logs are available for this execution yet."
				scopeSidebar={scopeSidebar}
				leading={<ExecutionLogsHeaderNav onBack={onBack} />}
			/>
		);
	}

	return (
		<ExecutionRunLogsContainer
			execution={execution}
			initialSource={rootSource}
			scopeSidebar={scopeSidebar}
			toolbarLeading={toolbarLeading}
		/>
	);
}
