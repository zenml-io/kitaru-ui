import type { DeploymentVersion } from "@/modules/deployments/domain/deployment";
import { LiveDurationMs } from "@/shared/ui/LiveDurationMs";
import { StatusIcon } from "@/shared/ui/StatusIcon";
import { cn } from "@/shared/utils/styles";
import { Link } from "@tanstack/react-router";
import type { Execution } from "../domain/execution";
import { formatExecutionIndex } from "../util/execution";

type ExecutionsListProps = {
	executions: Execution[];
	flowId: string;
	activeexecutionId: string;
	versionParam: DeploymentVersion;
};

export function ExecutionsList({
	executions,
	flowId,
	activeexecutionId,
	versionParam,
}: ExecutionsListProps) {
	return (
		<div className="flex h-full flex-col">
			<div className="border-border flex shrink-0 items-center border-b px-3 py-2.5">
				<span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
					Executions
				</span>
			</div>
			<div className="flex-1 overflow-y-auto">
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
						aria-current={
							execution.id === activeexecutionId ? "page" : undefined
						}
						className={cn(
							"flex items-center gap-1.5 px-2.5 py-1.5 transition-colors",
							execution.id === activeexecutionId
								? "bg-accent"
								: "hover:bg-accent/50"
						)}
					>
						<StatusIcon
							status={execution.status ?? "unknown"}
							size="size-4"
							tooltipSide="right"
						/>
						<span className="shrink-0 font-mono text-xs font-bold tabular-nums">
							#{formatExecutionIndex(execution.index)}
						</span>
						<LiveDurationMs
							status={execution.status}
							startTime={execution.startTime}
							durationMs={execution.durationMs}
							className="text-muted-foreground text-2xs ml-auto truncate font-mono tabular-nums"
						/>
					</Link>
				))}
			</div>
		</div>
	);
}
