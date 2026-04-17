import { useState } from "react";
import { toast } from "sonner";
import {
	getCheckpointDetailsPollingInterval,
	useCheckpointDetails,
} from "@/modules/checkpoints/business-logic/use-checkpoint-details";
import { CheckpointLogsContainer } from "@/modules/checkpoints/feature/CheckpointLogsContainer";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
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
import {
	ExecutionLogsScopeSidebar,
	type ExecutionLogsScope,
} from "../ui/ExecutionLogsScopeSidebar";

type ExecutionLogsContainerProps = {
	execution: Execution;
	checkpoints: CheckpointEntry[];
	selectedScope: ExecutionLogsScope;
	onSelectScope: (scope: ExecutionLogsScope) => void;
};

export function ExecutionLogsContainer({
	execution,
	checkpoints,
	selectedScope,
	onSelectScope,
}: ExecutionLogsContainerProps) {
	const [rootSource] = execution.logSources;
	return (
		<div className="flex h-full min-h-0">
			<ExecutionLogsScopeSidebar
				executionIndex={execution.index}
				checkpoints={checkpoints.map((c) => ({ id: c.id, name: c.name }))}
				selectedScope={selectedScope}
				onSelectScope={onSelectScope}
			/>
			<div className="flex min-w-0 flex-1 flex-col">
				{selectedScope.kind === "root" ? (
					rootSource ? (
						<RunLogsView execution={execution} initialSource={rootSource} />
					) : (
						<EmptyLogsState message="No logs are available for this execution yet." />
					)
				) : (
					<CheckpointScopeView
						key={selectedScope.checkpointId}
						checkpointId={selectedScope.checkpointId}
					/>
				)}
			</div>
		</div>
	);
}

function EmptyLogsState({ message }: { message: string }) {
	return (
		<div className="text-muted-foreground flex h-full items-center justify-center text-xs">
			{message}
		</div>
	);
}

type RunLogsViewProps = {
	execution: Execution;
	initialSource: string;
};

function RunLogsView({ execution, initialSource }: RunLogsViewProps) {
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
			{(logs.length > 0 || execution.logSources.length > 1) && (
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

function CheckpointScopeView({ checkpointId }: { checkpointId: string }) {
	const { detailsData } = useCheckpointDetails(checkpointId, {
		refetchInterval: getCheckpointDetailsPollingInterval,
	});
	return (
		<CheckpointLogsContainer
			checkpointId={checkpointId}
			logSources={detailsData.logSources}
			checkpointStatus={detailsData.status}
		/>
	);
}
