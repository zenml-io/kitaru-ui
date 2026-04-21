import type { ReactNode } from "react";
import { useLogSource } from "@/modules/logs/business-logic/use-log-source";
import {
	getExecutionLogsPollingInterval,
	useExecutionLogs,
} from "../business-logic/use-execution-logs";
import type { Execution } from "../domain/execution";
import { ExecutionLogsPanelContainer } from "./ExecutionLogsPanelContainer";

type ExecutionRunLogsContainerProps = {
	execution: Execution;
	initialSource: string;
	scopeSidebar: ReactNode;
	toolbarLeading: ReactNode;
};

export function ExecutionRunLogsContainer({
	execution,
	initialSource,
	scopeSidebar,
	toolbarLeading,
}: ExecutionRunLogsContainerProps) {
	const { selectedSource, setSelectedSource } = useLogSource(
		execution.logSources,
		initialSource
	);

	const logsQuery = useExecutionLogs(execution.id, selectedSource, {
		refetchInterval: getExecutionLogsPollingInterval(execution.status),
	});

	return (
		<ExecutionLogsPanelContainer
			logs={logsQuery.data ?? []}
			isLoading={logsQuery.isPending}
			error={logsQuery.error}
			onRetry={() => logsQuery.refetch()}
			sources={
				execution.logSources.length > 1 ? execution.logSources : undefined
			}
			selectedSource={selectedSource}
			onSourceChange={setSelectedSource}
			scopeSidebar={scopeSidebar}
			toolbarLeading={toolbarLeading}
			downloadFilename={`execution-${execution.id}.log`}
			errorContext={{ executionId: execution.id }}
		/>
	);
}
