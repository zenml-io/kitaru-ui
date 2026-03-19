import { CheckpointTypeBadge } from "@/modules/executions/ui/traces/CheckpointTypeBadge";
import { formatDurationShort } from "@/shared/utils/time";
import type { Checkpoint } from "../domain/checkpoint";

type CheckpointDetailPanelHeaderProps = {
	checkpoint: Checkpoint;
};

export function CheckpointDetailPanelHeader({
	checkpoint,
}: CheckpointDetailPanelHeaderProps) {
	return (
		<div className="border-border flex h-10 shrink-0 items-center gap-2 border-b px-4">
			<CheckpointTypeBadge type={checkpoint.type} />
			<span className="text-foreground truncate font-mono text-xs font-semibold">
				{checkpoint.name}
			</span>
			<span className="flex-1" />
			<span className="text-2xs text-muted-foreground font-mono tabular-nums">
				{formatDurationShort(checkpoint.durationMs)}
			</span>
		</div>
	);
}
