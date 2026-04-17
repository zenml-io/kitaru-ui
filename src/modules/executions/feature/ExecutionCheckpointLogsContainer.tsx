import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { checkpointsQueries } from "@/modules/checkpoints/business-logic/checkpoints-queries";
import { getCheckpointDetailsPollingInterval } from "@/modules/checkpoints/business-logic/use-checkpoint-details";
import { getCheckpointLogsPollingInterval } from "@/modules/checkpoints/business-logic/use-checkpoint-logs";
import { ExecutionLogsPanelContainer } from "./ExecutionLogsPanelContainer";

const DEFAULT_SOURCE = "checkpoint";

type ExecutionCheckpointLogsContainerProps = {
	checkpointId: string;
	scopeSidebar: ReactNode;
	toolbarLeading: ReactNode;
};

export function ExecutionCheckpointLogsContainer({
	checkpointId,
	scopeSidebar,
	toolbarLeading,
}: ExecutionCheckpointLogsContainerProps) {
	const detailsQuery = useQuery({
		...checkpointsQueries.details(checkpointId),
		refetchInterval: getCheckpointDetailsPollingInterval,
	});
	const logSources = detailsQuery.data?.logSources ?? [];
	const checkpointStatus = detailsQuery.data?.status;

	const [selectedSource, setSelectedSource] = useState<string>(DEFAULT_SOURCE);
	const effectiveSource = logSources.includes(selectedSource)
		? selectedSource
		: (logSources[0] ?? DEFAULT_SOURCE);

	const logsQuery = useQuery({
		...checkpointsQueries.logs(checkpointId, effectiveSource),
		enabled: logSources.length > 0,
		refetchInterval: getCheckpointLogsPollingInterval(checkpointStatus),
	});

	const isLoading =
		detailsQuery.isPending ||
		logsQuery.isPending ||
		(logSources.length === 0 && !detailsQuery.isError);

	return (
		<ExecutionLogsPanelContainer
			logs={logsQuery.data ?? []}
			isLoading={isLoading}
			error={detailsQuery.error ?? logsQuery.error}
			onRetry={() => {
				if (detailsQuery.isError) detailsQuery.refetch();
				if (logsQuery.isError) logsQuery.refetch();
			}}
			sources={logSources.length > 1 ? logSources : undefined}
			selectedSource={effectiveSource}
			onSourceChange={setSelectedSource}
			scopeSidebar={scopeSidebar}
			toolbarLeading={toolbarLeading}
			downloadFilename={`checkpoint-${checkpointId}.log`}
			errorContext={{ checkpointId }}
		/>
	);
}
