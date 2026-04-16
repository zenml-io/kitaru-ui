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

const DEFAULT_SOURCE = "step";

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

	const handleLevelChange = (level: LoggingLevel) => setSelectedLevel(level);

	async function copyAll() {
		try {
			await navigator.clipboard.writeText(formatLogsForExport(filteredLogs));
			toast.success("Logs copied to clipboard");
		} catch (err) {
			console.error("Failed to copy logs to clipboard", err);
			const reason = !window.isSecureContext ? " (requires HTTPS)" : "";
			toast.error(`Failed to copy logs${reason}`);
		}
	}

	async function copyRow(entry: LogEntry) {
		try {
			await navigator.clipboard.writeText(entry.originalEntry);
			toast.success("Log entry copied");
		} catch (err) {
			console.error("Failed to copy log entry to clipboard", err);
			const reason = !window.isSecureContext ? " (requires HTTPS)" : "";
			toast.error(`Failed to copy log entry${reason}`);
		}
	}

	function download() {
		let url: string | undefined;
		try {
			const blob = new Blob([formatLogsForExport(filteredLogs)], {
				type: "text/plain",
			});
			url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `checkpoint-${checkpointId}.log`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			toast.success("Logs downloaded");
		} catch (err) {
			console.error("Failed to download logs", err);
			toast.error("Failed to download logs");
		} finally {
			if (url) URL.revokeObjectURL(url);
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
