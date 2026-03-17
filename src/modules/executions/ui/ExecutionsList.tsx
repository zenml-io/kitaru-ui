import { Link } from "@tanstack/react-router";
import { StatusDot, type StatusDotVariant } from "@/shared/ui/StatusDot";
import { formatDuration } from "@/shared/utils/time";
import { cn } from "@/shared/utils/styles";
import type { Execution } from "../domain/execution";
import { ExecutionName } from "./ExecutionName";

interface ExecutionsListProps {
	executions: Execution[];
	flowId: string;
	activeexecutionId: string;
}

export function ExecutionsList({
	executions,
	flowId,
	activeexecutionId,
}: ExecutionsListProps) {
	return (
		<div className="flex flex-col">
			{executions.map((execution) => (
				<Link
					key={execution.id}
					to="/flows/$flowId/executions/$executionId"
					params={{ flowId, executionId: execution.id }}
					className={cn(
						"flex items-center justify-between gap-2 px-3 py-1.5 text-sm transition-colors",
						execution.id === activeexecutionId
							? "bg-accent"
							: "hover:bg-accent/50"
					)}
				>
					<ExecutionName index={execution.index} />
					<div className="flex shrink-0 items-center gap-1.5">
						<StatusDot
							status={(execution.status ?? "unknown") as StatusDotVariant}
						/>
						<span className="text-muted-foreground text-xs capitalize">
							{execution.status ?? "unknown"}
						</span>
						{formatDuration(execution.startTime, execution.endTime) && (
							<span className="text-muted-foreground text-xs">
								· {formatDuration(execution.startTime, execution.endTime)}
							</span>
						)}
					</div>
				</Link>
			))}
		</div>
	);
}
