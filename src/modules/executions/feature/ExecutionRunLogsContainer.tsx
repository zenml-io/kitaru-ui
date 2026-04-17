import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { executionsQueries } from "../business-logic/executions-queries";
import { getExecutionLogsPollingInterval } from "../business-logic/use-execution-logs";
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
	const [selectedSource, setSelectedSource] = useState<string>(initialSource);
	const effectiveSource = execution.logSources.includes(selectedSource)
		? selectedSource
		: initialSource;

	const logsQuery = useQuery({
		...executionsQueries.logs(execution.id, effectiveSource),
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
			selectedSource={effectiveSource}
			onSourceChange={setSelectedSource}
			scopeSidebar={scopeSidebar}
			toolbarLeading={toolbarLeading}
			downloadFilename={`execution-${execution.id}.log`}
			errorContext={{ executionId: execution.id }}
		/>
	);
}
