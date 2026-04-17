import { toast } from "sonner";
import { useCopy } from "@/shared/business-logic/use-copy";
import { downloadTextFile } from "@/shared/utils/download-file";
import type { LogEntry } from "../domain/log-entry";
import { formatLogsForExport } from "../util/format-logs";
import { useLogLevelFilter } from "./use-log-level-filter";
import { useLogSearch } from "./use-log-search";

type UseLogsViewParams = {
	logs: LogEntry[];
	downloadFilename: string;
	errorContext?: Record<string, unknown>;
};

export function useLogsView({
	logs,
	downloadFilename,
	errorContext,
}: UseLogsViewParams) {
	const { filteredLogs, selectedLevel, setSelectedLevel } =
		useLogLevelFilter(logs);
	const searchState = useLogSearch(filteredLogs);

	const { copy } = useCopy();
	const copyAll = () => copy(formatLogsForExport(filteredLogs));
	const copyRow = (entry: LogEntry) => copy(entry.originalEntry);

	function download() {
		try {
			downloadTextFile(downloadFilename, formatLogsForExport(filteredLogs));
			toast.success("Logs downloaded");
		} catch (err) {
			console.error("Failed to download logs", { ...errorContext, err });
			toast.error("Failed to download logs");
		}
	}

	return {
		filteredLogs,
		selectedLevel,
		setSelectedLevel,
		...searchState,
		copyAll,
		copyRow,
		download,
	};
}
