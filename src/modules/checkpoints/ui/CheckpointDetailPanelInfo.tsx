import {
	CheckpointDetailPanelRow as DetailRow,
	CheckpointDetailPanelRows as DetailRows,
} from "./CheckpointDetailPanelRow";
import { formatDurationShort } from "@/shared/utils/time";
import type { Checkpoint } from "../domain/checkpoint";

interface CheckpointDetailPanelInfoProps {
	checkpoint: Checkpoint;
}

export function CheckpointDetailPanelInfo({
	checkpoint,
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
				{(checkpoint.inputs.length > 0 || checkpoint.outputs.length > 0) && (
					<>
						<DetailRow label="Inputs">{checkpoint.inputs.length}</DetailRow>
						<DetailRow label="Outputs">{checkpoint.outputs.length}</DetailRow>
					</>
				)}
			</DetailRows>
		</div>
	);
}
