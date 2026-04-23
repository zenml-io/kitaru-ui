import type { ReactNode } from "react";
import type { Execution } from "../domain/execution";
import { ExecutionLogsEmptyState } from "../ui/ExecutionLogsEmptyState";
import { ExecutionLogsHeaderNav } from "../ui/ExecutionLogsHeaderNav";
import type { ExecutionLogsScope } from "./ExecutionLogsScopeSidebarContainer";
import { ExecutionCheckpointLogsContainer } from "./ExecutionCheckpointLogsContainer";
import { ExecutionRunLogsContainer } from "./ExecutionRunLogsContainer";

type ExecutionLogsContainerProps = {
	execution: Execution;
	selectedScope: ExecutionLogsScope;
	scopeSidebar: ReactNode;
	toolbarLeading: ReactNode;
	onBack: () => void;
};

export function ExecutionLogsContainer({
	execution,
	selectedScope,
	scopeSidebar,
	toolbarLeading,
	onBack,
}: ExecutionLogsContainerProps) {
	if (selectedScope.kind === "checkpoint") {
		return (
			<ExecutionCheckpointLogsContainer
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
