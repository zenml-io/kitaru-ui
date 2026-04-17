import { useState } from "react";
import { toast } from "sonner";
import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import {
	getCheckpointLogsPollingInterval,
	useCheckpointLogs,
} from "../business-logic/use-checkpoint-logs";
import { useLogLevelFilter } from "@/modules/logs/business-logic/use-log-level-filter";
import { useLogSearch } from "@/modules/logs/business-logic/use-log-search";
import type { LogEntry, LoggingLevel } from "@/modules/logs/domain/log-entry";
import { LogsList } from "@/modules/logs/ui/LogsList";
import { LogsToolbar } from "@/modules/logs/ui/LogsToolbar";
import { formatLogsForExport } from "@/modules/logs/util/format-logs";
import { useCopy } from "@/shared/business-logic/use-copy";
import { downloadTextFile } from "@/shared/utils/download-file";

const DEFAULT_SOURCE = "checkpoint";

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
	const [selectedSource, setSelectedSource] = useState<string>(DEFAULT_SOURCE);
	const effectiveSource = logSources.includes(selectedSource)
		? selectedSource
		: (logSources[0] ?? DEFAULT_SOURCE);

	const { logs } = useCheckpointLogs(checkpointId, effectiveSource, {
		refetchInterval: getCheckpointLogsPollingInterval(checkpointStatus),
	});

	const { filteredLogs, selectedLevel, setSelectedLevel } =
		useLogLevelFilter(logs);

	const {
		search,
		setSearch,
		matchCount,
		activeMatchIndex,
		activeMatch,
		matchesByLogIndex,
		nextMatch,
		prevMatch,
	} = useLogSearch(filteredLogs);

	const { copy } = useCopy();
	const handleLevelChange = (level: LoggingLevel) => setSelectedLevel(level);

	const copyAll = () => copy(formatLogsForExport(filteredLogs));
	const copyRow = (entry: LogEntry) => copy(entry.originalEntry);

	function download() {
		try {
			downloadTextFile(
				`checkpoint-${checkpointId}.log`,
				formatLogsForExport(filteredLogs)
			);
			toast.success("Logs downloaded");
		} catch (err) {
			console.error("Failed to download logs", err);
			toast.error("Failed to download logs");
		}
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			{(logs.length > 0 || logSources.length > 1) && (
				<LogsToolbar
					levelFilter={selectedLevel}
					onLevelFilterChange={handleLevelChange}
					search={search}
					onSearchChange={setSearch}
					matchCount={matchCount}
					activeMatchIndex={activeMatchIndex}
					onNextMatch={nextMatch}
					onPrevMatch={prevMatch}
					sources={logSources.length > 1 ? logSources : undefined}
					selectedSource={effectiveSource}
					onSourceChange={setSelectedSource}
					onCopyAll={copyAll}
					onDownload={download}
					canExport={filteredLogs.length > 0}
				/>
			)}
			<div className="min-h-0 flex-1">
				<LogsList
					logs={filteredLogs}
					density="compact"
					matchesByLogIndex={matchesByLogIndex}
					activeMatch={activeMatch}
					onCopyRow={copyRow}
				/>
			</div>
		</div>
	);
}
