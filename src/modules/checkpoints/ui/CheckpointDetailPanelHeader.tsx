import { CheckpointTypeBadge } from "@/modules/executions/ui/traces/CheckpointTypeBadge";
import type { Checkpoint } from "../domain/checkpoint";
import { Badge } from "@zenml/hashi/primitives/badge";
import { formatCost } from "@/shared/utils/currency";
import { LiveDurationMs } from "@/shared/ui/LiveDurationMs";
import { TruncatedText } from "@/shared/ui/truncated-text";
import type { ReactNode } from "react";

type CheckpointDetailPanelHeaderProps = {
	checkpoint: Checkpoint;
	trailing?: ReactNode;
};

export function CheckpointDetailPanelHeader({
	checkpoint,
	trailing,
}: CheckpointDetailPanelHeaderProps) {
	return (
		<div className="flex h-10 shrink-0 items-center gap-2 px-4">
			{checkpoint.type && <CheckpointTypeBadge type={checkpoint.type} />}
			{checkpoint.costUsd !== undefined && (
				<Badge variant="secondary">{formatCost(checkpoint.costUsd)}</Badge>
			)}
			<TruncatedText className="text-foreground font-mono text-xs font-semibold">
				{checkpoint.name}
			</TruncatedText>
			<span className="flex-1" />
			{trailing}
			<LiveDurationMs
				status={checkpoint.status}
				startTime={checkpoint.startTime}
				durationMs={checkpoint.durationMs}
				className="text-2xs text-muted-foreground font-mono tabular-nums"
			/>
		</div>
	);
}
