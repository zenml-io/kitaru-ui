import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { checkpointsQueries } from "@/modules/checkpoints/business-logic/checkpoints-queries";
import { getCheckpointDetailsPollingInterval } from "@/modules/checkpoints/business-logic/use-checkpoint-details";
import { getCheckpointLogsPollingInterval } from "@/modules/checkpoints/business-logic/use-checkpoint-logs";
import { useLogSource } from "@/modules/logs/business-logic/use-log-source";
import { ExecutionLogsEmptyState } from "../ui/ExecutionLogsEmptyState";
import { ExecutionLogsPanelContainer } from "./ExecutionLogsPanelContainer";

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

	const { selectedSource, setSelectedSource } = useLogSource(
		logSources,
		"checkpoint"
	);

	const logsQuery = useQuery({
		...checkpointsQueries.logs(checkpointId, selectedSource),
		enabled: logSources.length > 0,
		refetchInterval: getCheckpointLogsPollingInterval(checkpointStatus),
	});

	if (detailsQuery.isSuccess && logSources.length === 0) {
		return (
			<ExecutionLogsEmptyState
				message="No logs are available for this checkpoint yet."
				scopeSidebar={scopeSidebar}
				leading={toolbarLeading}
			/>
		);
	}

	const isLoading =
		detailsQuery.isPending || (logSources.length > 0 && logsQuery.isPending);

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
			selectedSource={selectedSource}
			onSourceChange={setSelectedSource}
			scopeSidebar={scopeSidebar}
			toolbarLeading={toolbarLeading}
			downloadFilename={`checkpoint-${checkpointId}.log`}
			errorContext={{ checkpointId }}
		/>
	);
}
