import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import { useLogSource } from "@/modules/logs/business-logic/use-log-source";
import { useLogsExport } from "@/modules/logs/business-logic/use-logs-export";
import { useLogsFilter } from "@/modules/logs/business-logic/use-logs-filter";
import { LogsList } from "@/modules/logs/ui/LogsList";
import { LogsToolbar } from "@/modules/logs/ui/LogsToolbar";
import {
	getCheckpointLogsPollingInterval,
	useCheckpointLogs,
} from "../business-logic/use-checkpoint-logs";

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
	const { selectedSource, setSelectedSource } = useLogSource(
		logSources,
		"checkpoint"
	);
	const { logs } = useCheckpointLogs(checkpointId, selectedSource, {
		refetchInterval: getCheckpointLogsPollingInterval(checkpointStatus),
	});
	const filter = useLogsFilter(logs);
	const exp = useLogsExport({
		logs: filter.filteredLogs,
		downloadFilename: `checkpoint-${checkpointId}.log`,
		errorContext: { checkpointId },
	});
	const shouldShowToolbar = logs.length > 0 || logSources.length > 1;

	return (
		<div className="flex h-full min-h-0 flex-col">
			{shouldShowToolbar && (
				<LogsToolbar
					levelFilter={filter.selectedLevel}
					onLevelFilterChange={filter.setSelectedLevel}
					search={filter.search}
					onSearchChange={filter.setSearch}
					matchCount={filter.matchCount}
					activeMatchIndex={filter.activeMatchIndex}
					onNextMatch={filter.nextMatch}
					onPrevMatch={filter.prevMatch}
					sources={logSources.length > 1 ? logSources : undefined}
					selectedSource={selectedSource}
					onSourceChange={setSelectedSource}
					onCopyAll={exp.copyAll}
					onDownload={exp.download}
					canExport={filter.filteredLogs.length > 0}
				/>
			)}
			<div className="min-h-0 flex-1">
				<LogsList
					logs={filter.filteredLogs}
					density="compact"
					matchesByLogIndex={filter.matchesByLogIndex}
					activeMatch={filter.activeMatch}
					onCopyRow={exp.copyRow}
				/>
			</div>
		</div>
	);
}
