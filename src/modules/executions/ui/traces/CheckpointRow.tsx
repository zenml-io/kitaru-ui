import { StatusDot } from "@/shared/ui/StatusDot";
import { CheckpointTypeBadge } from "./CheckpointTypeBadge";
import { CheckpointRowArtifacts } from "./CheckpointRowArtifacts";
import { ExpandableRow } from "./ExpandableRow";
import type {
	ArtifactPanelTarget,
	CheckpointEntry,
	SelectedArtifact,
} from "@/modules/checkpoints/domain/checkpoint";
import { LiveDurationMs } from "@/shared/ui/LiveDurationMs";
import { TruncatedText } from "@/shared/ui/truncated-text";

type CheckpointRowProps = {
	checkpointEntry: CheckpointEntry;
	onSelect: (id: string) => void;
	onViewArtifactInPanel: (target: ArtifactPanelTarget) => void;
};

export function CheckpointRow({
	checkpointEntry,
	onSelect,
	onViewArtifactInPanel,
}: CheckpointRowProps) {
	return (
		<ExpandableRow
			onToggle={() => onSelect(checkpointEntry.id)}
			header={
				<>
					{checkpointEntry.type && (
						<CheckpointTypeBadge type={checkpointEntry.type} />
					)}
					<TruncatedText className="text-foreground font-mono text-xs font-semibold">
						{checkpointEntry.name}
					</TruncatedText>
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
			<CheckpointRowArtifacts
				checkpointId={checkpointEntry.id}
				onViewArtifactInPanel={(selection: SelectedArtifact) =>
					onViewArtifactInPanel({
						checkpointId: checkpointEntry.id,
						...selection,
					})
				}
			/>
		</ExpandableRow>
	);
}
