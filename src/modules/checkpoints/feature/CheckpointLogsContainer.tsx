import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import { LogsList } from "@/modules/logs/ui/LogsList";
import { LogsToolbar } from "@/modules/logs/ui/LogsToolbar";
import { useCheckpointLogsView } from "../business-logic/use-checkpoint-logs-view";

type CheckpointLogsContainerProps = {
	checkpointId: string;
	logSources: string[];
	checkpointStatus?: ExecutionStatus;
};

export function CheckpointLogsContainer({
	checkpointId,
	logSources,
	checkpointStatus,
}: CheckpointLogsContainerProps) {
	const view = useCheckpointLogsView(
		checkpointId,
		logSources,
		checkpointStatus
	);
	const shouldShowToolbar = view.logs.length > 0 || logSources.length > 1;

	return (
		<div className="flex h-full min-h-0 flex-col">
			{shouldShowToolbar && (
				<LogsToolbar
					levelFilter={view.selectedLevel}
					onLevelFilterChange={view.setSelectedLevel}
					search={view.search}
					onSearchChange={view.setSearch}
					matchCount={view.matchCount}
					activeMatchIndex={view.activeMatchIndex}
					onNextMatch={view.nextMatch}
					onPrevMatch={view.prevMatch}
					sources={logSources.length > 1 ? logSources : undefined}
					selectedSource={view.selectedSource}
					onSourceChange={view.setSelectedSource}
					onCopyAll={view.copyAll}
					onDownload={view.download}
					canExport={view.filteredLogs.length > 0}
				/>
			)}
			<div className="min-h-0 flex-1">
				<LogsList
					logs={view.filteredLogs}
					density="compact"
					matchesByLogIndex={view.matchesByLogIndex}
					activeMatch={view.activeMatch}
					onCopyRow={view.copyRow}
				/>
			</div>
		</div>
	);
}
