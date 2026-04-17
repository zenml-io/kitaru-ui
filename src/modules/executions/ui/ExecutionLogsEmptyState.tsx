import type { ReactNode } from "react";
import { ExecutionLogsHeaderNav } from "./ExecutionLogsHeaderNav";

type ExecutionLogsEmptyStateProps = {
	message: string;
	scopeSidebar: ReactNode;
	onBackToExecution?: () => void;
	onToggleSidebar?: () => void;
	sidebarOpen?: boolean;
};

export function ExecutionLogsEmptyState({
	message,
	scopeSidebar,
	onBackToExecution,
	onToggleSidebar,
	sidebarOpen,
}: ExecutionLogsEmptyStateProps) {
	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="border-border flex shrink-0 items-center gap-2 border-b p-2">
				<ExecutionLogsHeaderNav
					onBackToExecution={onBackToExecution}
					onToggleSidebar={onToggleSidebar}
					sidebarOpen={sidebarOpen}
				/>
			</div>
			<div className="flex min-h-0 flex-1">
				{scopeSidebar}
				<div className="text-muted-foreground flex min-w-0 flex-1 items-center justify-center text-xs">
					{message}
				</div>
			</div>
		</div>
	);
}
