import { useState } from "react";
import { toast } from "sonner";
import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import { useLogLevelFilter } from "@/modules/logs/business-logic/use-log-level-filter";
import { useLogSearch } from "@/modules/logs/business-logic/use-log-search";
import type { LogEntry } from "@/modules/logs/domain/log-entry";
import { formatLogsForExport } from "@/modules/logs/util/format-logs";
import { useCopy } from "@/shared/business-logic/use-copy";
import { downloadTextFile } from "@/shared/utils/download-file";
import {
	getCheckpointLogsPollingInterval,
	useCheckpointLogs,
} from "./use-checkpoint-logs";

const DEFAULT_SOURCE = "checkpoint";

export function useCheckpointLogsView(
	checkpointId: string,
	logSources: string[],
	checkpointStatus?: ExecutionStatus
) {
	const [selectedSource, setSelectedSource] = useState<string>(DEFAULT_SOURCE);
	const effectiveSource = logSources.includes(selectedSource)
		? selectedSource
		: (logSources[0] ?? DEFAULT_SOURCE);

	const { logs } = useCheckpointLogs(checkpointId, effectiveSource, {
		refetchInterval: getCheckpointLogsPollingInterval(checkpointStatus),
	});

	const { filteredLogs, selectedLevel, setSelectedLevel } =
		useLogLevelFilter(logs);

	const searchState = useLogSearch(filteredLogs);

	const { copy } = useCopy();
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

	return {
		logs,
		filteredLogs,
		selectedLevel,
		setSelectedLevel,
		selectedSource: effectiveSource,
		setSelectedSource,
		...searchState,
		copyAll,
		copyRow,
		download,
	};
}
