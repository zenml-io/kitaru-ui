import { toast } from "sonner";
import { useCopy } from "@/shared/business-logic/use-copy";
import { downloadTextFile } from "@/shared/utils/download-file";
import type { LogEntry } from "../domain/log-entry";
import { formatLogsForExport } from "../util/format-logs";

type UseLogsExportParams = {
	logs: LogEntry[];
	downloadFilename: string;
	errorContext?: Record<string, unknown>;
};

export function useLogsExport({
	logs,
	downloadFilename,
	errorContext,
}: UseLogsExportParams) {
	const { copy } = useCopy();
	const copyAll = () => copy(formatLogsForExport(logs));
	const copyRow = (entry: LogEntry) => copy(entry.originalEntry);

	function download() {
		const text = formatLogsForExport(logs);
		try {
			downloadTextFile(downloadFilename, text);
			toast.success("Logs downloaded");
		} catch (err) {
			console.error("Failed to download logs", { ...errorContext, err });
			toast.error("Failed to download logs");
		}
	}

	return { copyAll, copyRow, download };
}
