import { useState } from "react";
import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import { useLogsView } from "@/modules/logs/business-logic/use-logs-view";
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

	return {
		logs,
		selectedSource: effectiveSource,
		setSelectedSource,
		...useLogsView({
			logs,
			downloadFilename: `checkpoint-${checkpointId}.log`,
			errorContext: { checkpointId },
		}),
	};
}
