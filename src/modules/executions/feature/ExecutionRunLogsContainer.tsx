import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useLogLevelFilter } from "@/modules/logs/business-logic/use-log-level-filter";
import { useLogSearch } from "@/modules/logs/business-logic/use-log-search";
import type { LogEntry, LoggingLevel } from "@/modules/logs/domain/log-entry";
import { LogsList } from "@/modules/logs/ui/LogsList";
import { LogsToolbar } from "@/modules/logs/ui/LogsToolbar";
import { formatLogsForExport } from "@/modules/logs/util/format-logs";
import { useCopy } from "@/shared/business-logic/use-copy";
import { downloadTextFile } from "@/shared/utils/download-file";
import {
	getExecutionLogsPollingInterval,
	useExecutionLogs,
} from "../business-logic/use-execution-logs";
import type { Execution } from "../domain/execution";

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

	const { logs } = useExecutionLogs(execution.id, effectiveSource, {
		refetchInterval: getExecutionLogsPollingInterval(execution.status),
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
				`execution-${execution.id}.log`,
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
			<LogsToolbar
				levelFilter={selectedLevel}
				onLevelFilterChange={handleLevelChange}
				search={search}
				onSearchChange={setSearch}
				matchCount={matchCount}
				activeMatchIndex={activeMatchIndex}
				onNextMatch={nextMatch}
				onPrevMatch={prevMatch}
				sources={
					execution.logSources.length > 1 ? execution.logSources : undefined
				}
				selectedSource={effectiveSource}
				onSourceChange={setSelectedSource}
				onCopyAll={copyAll}
				onDownload={download}
				canExport={filteredLogs.length > 0}
				leading={toolbarLeading}
			/>
			<div className="flex min-h-0 flex-1">
				{scopeSidebar}
				<div className="min-w-0 flex-1">
					<LogsList
						logs={filteredLogs}
						density="compact"
						matchesByLogIndex={matchesByLogIndex}
						activeMatch={activeMatch}
						onCopyRow={copyRow}
					/>
				</div>
			</div>
		</div>
	);
}
