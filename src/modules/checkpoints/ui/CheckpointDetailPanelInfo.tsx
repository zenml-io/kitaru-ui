import {
	CheckpointDetailPanelRow as DetailRow,
	CheckpointDetailPanelRows as DetailRows,
} from "./CheckpointDetailPanelRow";
import { formatDurationShort } from "@/shared/utils/time";
import type { Checkpoint } from "../domain/checkpoint";
import type { ArtifactEntry } from "../domain/checkpoint-artifacts";

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
				<DetailRow label="Status" className="capitalize">
					{checkpoint.status}
				</DetailRow>
				<DetailRow label="Duration" className="tabular-nums">
					{formatDurationShort(checkpoint.durationMs)}
				</DetailRow>
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
