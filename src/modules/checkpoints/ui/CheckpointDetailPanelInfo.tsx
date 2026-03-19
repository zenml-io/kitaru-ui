import {
	CheckpointDetailPanelRow as DetailRow,
	CheckpointDetailPanelRows as DetailRows,
} from "./CheckpointDetailPanelRow";
import { formatDurationShort } from "@/shared/utils/time";
import type { ArtifactEntry, Checkpoint } from "../domain/checkpoint-details";

interface CheckpointDetailPanelInfoProps {
	checkpoint: Checkpoint;
	inputs: ArtifactEntry[];
	outputs: ArtifactEntry[];
}

export function CheckpointDetailPanelInfo({
	checkpoint,
	inputs,
	outputs,
}: CheckpointDetailPanelInfoProps) {
	return (
		<div className="space-y-4 p-4">
			<DetailRows>
				<DetailRow label="ID" className="font-mono">
					{checkpoint.id}
				</DetailRow>
				<DetailRow label="Type">{checkpoint.type ?? "—"}</DetailRow>
				{checkpoint.status !== undefined && (
					<DetailRow label="Status" className="capitalize">
						{checkpoint.status}
					</DetailRow>
				)}
				{checkpoint.durationMs !== undefined && (
					<DetailRow label="Duration" className="tabular-nums">
						{formatDurationShort(checkpoint.durationMs)}
					</DetailRow>
				)}
				{(inputs.length > 0 || outputs.length > 0) && (
					<>
						<DetailRow label="Inputs">{inputs.length}</DetailRow>
						<DetailRow label="Outputs">{outputs.length}</DetailRow>
					</>
				)}
			</DetailRows>
		</div>
	);
}
