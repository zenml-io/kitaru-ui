import { Card } from "@zenml/hashi/primitives/card";
import { cn } from "@zenml/hashi/lib/utils";
import type { ReactNode } from "react";

type ProjectGradient = "zen-green" | "zen-slate" | "zen-sand" | "kitaru-amber";

const GRADIENT_BG: Record<ProjectGradient, string> = {
	"zen-green": "bg-gradient-to-br from-primary/85 via-primary/55 to-primary/25",
	"zen-slate":
		"bg-gradient-to-br from-muted-foreground/55 via-muted-foreground/30 to-muted-foreground/10",
	"zen-sand": "bg-gradient-to-br from-chart-2/70 via-chart-2/45 to-chart-2/15",
	"kitaru-amber":
		"bg-gradient-to-br from-chart-1/85 via-chart-1/55 to-chart-1/25",
};

interface WorkspaceProjectCardProps {
	name: string;
	path: string;
	gradient: ProjectGradient;
	statisticsSlot?: ReactNode;
	className?: string;
}

export function WorkspaceProjectCard({
	name,
	path,
	gradient,
	statisticsSlot,
	className,
}: WorkspaceProjectCardProps) {
	return (
		<Card
			data-slot="workspace-project-card"
			className={cn(
				"dark:hover:border-foreground/20 gap-0 overflow-hidden p-0 hover:shadow-md",
				className
			)}
		>
			<div className={cn("h-28 w-full", GRADIENT_BG[gradient])} aria-hidden />
			<div className="space-y-3 p-4">
				<div>
					<div className="text-foreground truncate font-mono text-base font-semibold">
						{name}
					</div>
					<div className="text-muted-foreground mt-0.5 truncate font-mono text-xs">
						{path}
					</div>
				</div>
				{statisticsSlot}
			</div>
		</Card>
	);
}

export function ProjectStatistics({
	flows,
	executions,
}: {
	flows: number;
	executions: number;
}) {
	return (
		<div className="flex items-center gap-4 text-xs">
			<span className="text-muted-foreground inline-flex items-center gap-1 tabular-nums">
				<span className="text-foreground font-semibold">{flows}</span>
				{flows === 1 ? "flow" : "flows"}
			</span>
			<span className="text-muted-foreground inline-flex items-center gap-1 tabular-nums">
				<span className="text-foreground font-semibold">{executions}</span>
				{executions === 1 ? "execution" : "executions"}
			</span>
		</div>
	);
}
