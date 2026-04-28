import type { LOCAL_VERSION_ID } from "@/modules/deployments/domain/local-deployment";
import { StatusDot, type StatusDotVariant } from "@/shared/ui/StatusDot";
import { cn } from "@/shared/utils/styles";
import { formatDuration } from "@/shared/utils/time";
import { Link } from "@tanstack/react-router";
import type { Execution } from "../domain/execution";
import { ExecutionName } from "./ExecutionName";

type ExecutionsListProps = {
	executions: Execution[];
	flowId: string;
	activeexecutionId: string;
	versionParam: number | typeof LOCAL_VERSION_ID;
};

export function ExecutionsList({
	executions,
	flowId,
	activeexecutionId,
	versionParam,
}: ExecutionsListProps) {
	return (
		<div className="flex h-full flex-col">
			<div className="text-muted-foreground px-3 py-2 text-xs font-semibold">
				Executions
			</div>
			{executions.map((execution) => (
				<Link
					key={execution.id}
					to="/flows/$flowId/v/$version/executions/$executionId"
					params={{
						flowId,
						version: versionParam,
						executionId: execution.id,
					}}
					search={(prev) => (prev.tab === "logs" ? { tab: "logs" } : {})}
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
							showTooltip={false}
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
