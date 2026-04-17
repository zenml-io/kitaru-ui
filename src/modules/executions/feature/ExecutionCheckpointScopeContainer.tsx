import type { ReactNode } from "react";
import {
	getCheckpointDetailsPollingInterval,
	useCheckpointDetails,
} from "@/modules/checkpoints/business-logic/use-checkpoint-details";
import { useCheckpointLogsView } from "@/modules/checkpoints/business-logic/use-checkpoint-logs-view";
import { LogsList } from "@/modules/logs/ui/LogsList";
import { LogsToolbar } from "@/modules/logs/ui/LogsToolbar";

type ExecutionCheckpointScopeContainerProps = {
	checkpointId: string;
	scopeSidebar: ReactNode;
	toolbarLeading: ReactNode;
};

export function ExecutionCheckpointScopeContainer({
	checkpointId,
	scopeSidebar,
	toolbarLeading,
}: ExecutionCheckpointScopeContainerProps) {
	const { detailsData } = useCheckpointDetails(checkpointId, {
		refetchInterval: getCheckpointDetailsPollingInterval,
	});

	const view = useCheckpointLogsView(
		checkpointId,
		detailsData.logSources,
		detailsData.status
	);

	return (
		<div className="flex h-full min-h-0 flex-col">
			<LogsToolbar
				levelFilter={view.selectedLevel}
				onLevelFilterChange={view.setSelectedLevel}
				search={view.search}
				onSearchChange={view.setSearch}
				matchCount={view.matchCount}
				activeMatchIndex={view.activeMatchIndex}
				onNextMatch={view.nextMatch}
				onPrevMatch={view.prevMatch}
				sources={
					detailsData.logSources.length > 1 ? detailsData.logSources : undefined
				}
				selectedSource={view.selectedSource}
				onSourceChange={view.setSelectedSource}
				onCopyAll={view.copyAll}
				onDownload={view.download}
				canExport={view.filteredLogs.length > 0}
				leading={toolbarLeading}
			/>
			<div className="flex min-h-0 flex-1">
				{scopeSidebar}
				<div className="min-w-0 flex-1">
					<LogsList
						logs={view.filteredLogs}
						density="compact"
						matchesByLogIndex={view.matchesByLogIndex}
						activeMatch={view.activeMatch}
						onCopyRow={view.copyRow}
					/>
				</div>
			</div>
		</div>
	);
}
