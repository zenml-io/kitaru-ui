import type { ReactNode } from "react";
import { useLogsView } from "@/modules/logs/business-logic/use-logs-view";
import type { LogEntry } from "@/modules/logs/domain/log-entry";
import { LogsList } from "@/modules/logs/ui/LogsList";
import { LogsListSkeleton } from "@/modules/logs/ui/LogsListSkeleton";
import { LogsToolbar } from "@/modules/logs/ui/LogsToolbar";
import { ExecutionLogsErrorState } from "../ui/ExecutionLogsErrorState";

type ExecutionLogsPanelContainerProps = {
	logs: LogEntry[];
	isLoading: boolean;
	error: unknown;
	onRetry: () => void;
	sources: string[] | undefined;
	selectedSource: string | undefined;
	onSourceChange: (source: string) => void;
	scopeSidebar: ReactNode;
	toolbarLeading: ReactNode;
	downloadFilename: string;
	errorContext: Record<string, unknown>;
};

export function ExecutionLogsPanelContainer({
	logs,
	isLoading,
	error,
	onRetry,
	sources,
	selectedSource,
	onSourceChange,
	scopeSidebar,
	toolbarLeading,
	downloadFilename,
	errorContext,
}: ExecutionLogsPanelContainerProps) {
	const view = useLogsView({ logs, downloadFilename, errorContext });
	const hasError = error !== null && error !== undefined && logs.length === 0;

	return (
		<div className="flex h-full min-h-0 flex-col">
			<LogsToolbar
				disabled={isLoading || hasError}
				levelFilter={view.selectedLevel}
				onLevelFilterChange={view.setSelectedLevel}
				search={view.search}
				onSearchChange={view.setSearch}
				matchCount={view.matchCount}
				activeMatchIndex={view.activeMatchIndex}
				onNextMatch={view.nextMatch}
				onPrevMatch={view.prevMatch}
				sources={sources}
				selectedSource={selectedSource}
				onSourceChange={onSourceChange}
				onCopyAll={view.copyAll}
				onDownload={view.download}
				canExport={view.filteredLogs.length > 0}
				leading={toolbarLeading}
			/>
			<div className="flex min-h-0 flex-1">
				{scopeSidebar}
				<div className="min-w-0 flex-1">
					{hasError ? (
						<ExecutionLogsErrorState error={error} onRetry={onRetry} />
					) : isLoading ? (
						<LogsListSkeleton />
					) : (
						<LogsList
							logs={view.filteredLogs}
							density="compact"
							showHeaders
							matchesByLogIndex={view.matchesByLogIndex}
							activeMatch={view.activeMatch}
							onCopyRow={view.copyRow}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
