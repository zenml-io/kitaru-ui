import { useState } from "react";
import { toast } from "sonner";
import { useCheckpointDetails } from "../business-logic/use-checkpoint-details";
import {
	getCheckpointLogsPollingInterval,
	useCheckpointLogs,
} from "../business-logic/use-checkpoint-logs";
import { useLogLevelFilter } from "@/modules/logs/business-logic/use-log-level-filter";
import { useLogSearch } from "@/modules/logs/business-logic/use-log-search";
import type { LogEntry } from "@/modules/logs/domain/log-entry";
import { LogsList } from "@/modules/logs/ui/LogsList";
import { LogsToolbar, type LevelFilter } from "@/modules/logs/ui/LogsToolbar";

const DEFAULT_SOURCE = "step";

function formatForClipboard(entries: LogEntry[]): string {
	return entries.map((e) => e.originalEntry).join("\n");
}

type CheckpointLogsContainerProps = {
	checkpointId: string;
};

export function CheckpointLogsContainer({
	checkpointId,
}: CheckpointLogsContainerProps) {
	const { detailsData } = useCheckpointDetails(checkpointId);
	const sources = detailsData?.logSources ?? [];
	const checkpointStatus = detailsData?.status;

	const [selectedSource, setSelectedSource] = useState<string>(DEFAULT_SOURCE);
	const effectiveSource = sources.includes(selectedSource)
		? selectedSource
		: (sources[0] ?? DEFAULT_SOURCE);

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

	const handleLevelChange = (level: LevelFilter) => setSelectedLevel(level);

	async function copyAll() {
		try {
			await navigator.clipboard.writeText(formatForClipboard(filteredLogs));
			toast.success("Logs copied to clipboard");
		} catch {
			toast.error("Failed to copy logs");
		}
	}

	async function copyRow(entry: LogEntry) {
		try {
			await navigator.clipboard.writeText(entry.originalEntry);
			toast.success("Log entry copied");
		} catch {
			toast.error("Failed to copy log entry");
		}
	}

	function download() {
		const blob = new Blob([formatForClipboard(filteredLogs)], {
			type: "text/plain",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `checkpoint-${checkpointId}.log`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
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
				sources={sources.length > 1 ? sources : undefined}
				selectedSource={effectiveSource}
				onSourceChange={setSelectedSource}
				onCopyAll={copyAll}
				onDownload={download}
			/>
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
