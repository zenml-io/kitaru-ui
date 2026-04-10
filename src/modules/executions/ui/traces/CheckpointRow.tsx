import { StatusDot } from "@/shared/ui/StatusDot";
import { CheckpointTypeBadge } from "./CheckpointTypeBadge";
import { CheckpointRowArtifacts } from "./CheckpointRowArtifacts";
import { ExpandableRow } from "./ExpandableRow";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { LiveDurationMs } from "@/shared/ui/LiveDurationMs";

type CheckpointRowProps = {
	checkpointEntry: CheckpointEntry;
	onSelect: (id: string) => void;
};

export function CheckpointRow({
	checkpointEntry,
	onSelect,
}: CheckpointRowProps) {
	return (
		<ExpandableRow
			onToggle={() => onSelect(checkpointEntry.id)}
			header={
				<>
					{checkpointEntry.type && (
						<CheckpointTypeBadge type={checkpointEntry.type} />
					)}
					<span className="text-foreground truncate font-mono text-xs font-semibold">
						{checkpointEntry.name}
					</span>
					<span className="flex-1" />
					<LiveDurationMs
						status={checkpointEntry.status}
						startTime={checkpointEntry.startTime}
						durationMs={checkpointEntry.durationMs}
						className="text-2xs text-muted-foreground font-mono tabular-nums"
					/>
					<StatusDot status={checkpointEntry.status} />
				</>
			}
		>
			<CheckpointRowArtifacts checkpointId={checkpointEntry.id} />
		</ExpandableRow>
	);
}
