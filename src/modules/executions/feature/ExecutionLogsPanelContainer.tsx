import type { ReactNode } from "react";
import { useLogsExport } from "@/modules/logs/business-logic/use-logs-export";
import { useLogsFilter } from "@/modules/logs/business-logic/use-logs-filter";
import type { LogEntry } from "@/modules/logs/domain/log-entry";
import { LogsList } from "@/modules/logs/ui/LogsList";
import { LogsListSkeleton } from "@/modules/logs/ui/LogsListSkeleton";
import { LogsToolbar } from "@/modules/logs/ui/LogsToolbar";
import { ExecutionLogsErrorState } from "../ui/ExecutionLogsErrorState";
import { ExecutionLogsStaleBanner } from "../ui/ExecutionLogsStaleBanner";

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
	const filter = useLogsFilter(logs);
	const exp = useLogsExport({
		logs: filter.filteredLogs,
		downloadFilename,
		errorContext,
	});
	const hasError = error != null && logs.length === 0;
	const hasStalePollError = error != null && logs.length > 0;

	return (
		<div className="flex h-full min-h-0 flex-col">
			<LogsToolbar
				disabled={isLoading || hasError}
				levelFilter={filter.selectedLevel}
				onLevelFilterChange={filter.setSelectedLevel}
				search={filter.search}
				onSearchChange={filter.setSearch}
				matchCount={filter.matchCount}
				activeMatchIndex={filter.activeMatchIndex}
				onNextMatch={filter.nextMatch}
				onPrevMatch={filter.prevMatch}
				sources={sources}
				selectedSource={selectedSource}
				onSourceChange={onSourceChange}
				onCopyAll={exp.copyAll}
				onDownload={exp.download}
				canExport={filter.filteredLogs.length > 0}
				leading={toolbarLeading}
			/>
			{hasStalePollError && <ExecutionLogsStaleBanner onRetry={onRetry} />}
			<div className="flex min-h-0 flex-1">
				{scopeSidebar}
				<div className="min-w-0 flex-1">
					{hasError ? (
						<ExecutionLogsErrorState error={error} onRetry={onRetry} />
					) : isLoading ? (
						<LogsListSkeleton />
					) : (
						<LogsList
							logs={filter.filteredLogs}
							density="compact"
							matchesByLogIndex={filter.matchesByLogIndex}
							activeMatch={filter.activeMatch}
							onCopyRow={exp.copyRow}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
