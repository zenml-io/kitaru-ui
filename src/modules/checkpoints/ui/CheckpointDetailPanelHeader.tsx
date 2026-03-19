import { CheckpointTypeBadge } from "@/modules/executions/ui/traces/CheckpointTypeBadge";
import type { Checkpoint } from "../domain/checkpoint";
import { Badge } from "@/shared/ui/badge";
import { formatCost } from "@/shared/utils/currency";
import { formatDurationShort } from "@/shared/utils/time";

type CheckpointDetailPanelHeaderProps = {
	checkpoint: Checkpoint;
};

export function CheckpointDetailPanelHeader({
	checkpoint,
}: CheckpointDetailPanelHeaderProps) {
	return (
		<div className="border-border flex h-10 shrink-0 items-center gap-2 border-b px-4">
			{checkpoint.type && <CheckpointTypeBadge type={checkpoint.type} />}
			{checkpoint.costUsd !== undefined && (
				<Badge variant="secondary">{formatCost(checkpoint.costUsd)}</Badge>
			)}
			<span className="text-foreground truncate font-mono text-xs font-semibold">
				{checkpoint.name}
			</span>
			<span className="flex-1" />
			{checkpoint.durationMs !== undefined && (
				<span className="text-2xs text-muted-foreground font-mono tabular-nums">
					{formatDurationShort(checkpoint.durationMs)}
				</span>
			)}
		</div>
	);
}
