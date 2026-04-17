import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { LogsListSkeleton } from "@/modules/logs/ui/LogsListSkeleton";
import { LogsToolbarSkeleton } from "@/modules/logs/ui/LogsToolbarSkeleton";
import {
	ExecutionLogsScopeSidebar,
	type ExecutionLogsScope,
} from "../ui/ExecutionLogsScopeSidebar";
import { ExecutionLogsHeaderNav } from "../ui/ExecutionLogsHeaderNav";

type LogsLoadingShellProps = {
	executionIndex: number;
	checkpoints: CheckpointEntry[];
	selectedScope: ExecutionLogsScope;
	onSelectScope: (scope: ExecutionLogsScope) => void;
	onBackToExecution?: () => void;
	onToggleSidebar?: () => void;
	sidebarOpen?: boolean;
};

export function LogsLoadingShell({
	executionIndex,
	checkpoints,
	selectedScope,
	onSelectScope,
	onBackToExecution,
	onToggleSidebar,
	sidebarOpen,
}: LogsLoadingShellProps) {
	return (
		<div className="flex h-full min-h-0 flex-col">
			<LogsToolbarSkeleton
				leading={
					<ExecutionLogsHeaderNav
						onBackToExecution={onBackToExecution}
						onToggleSidebar={onToggleSidebar}
						sidebarOpen={sidebarOpen}
						withTrailingSeparator
					/>
				}
			/>
			<div className="flex min-h-0 flex-1">
				<ExecutionLogsScopeSidebar
					executionIndex={executionIndex}
					checkpoints={checkpoints.map((c) => ({ id: c.id, name: c.name }))}
					selectedScope={selectedScope}
					onSelectScope={onSelectScope}
				/>
				<div className="min-w-0 flex-1">
					<LogsListSkeleton />
				</div>
			</div>
		</div>
	);
}
