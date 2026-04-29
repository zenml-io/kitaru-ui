import type { ReactNode } from "react";

type ExecutionLogsEmptyStateProps = {
	message: string;
	scopeSidebar: ReactNode;
	leading: ReactNode;
};

export function ExecutionLogsEmptyState({
	message,
	scopeSidebar,
	leading,
}: ExecutionLogsEmptyStateProps) {
	return (
		<div
			data-testid="execution-logs-empty"
			className="flex h-full min-h-0 flex-col"
		>
			<div className="border-border flex shrink-0 items-center gap-2 border-b p-2">
				{leading}
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
