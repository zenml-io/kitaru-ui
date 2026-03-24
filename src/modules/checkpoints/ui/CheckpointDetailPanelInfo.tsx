import {
	CheckpointDetailPanelRow as DetailRow,
	CheckpointDetailPanelRows as DetailRows,
} from "./CheckpointDetailPanelRow";
import { getCanShowDuration } from "@/shared/business-logic/duration";
import { LiveDurationMs } from "@/shared/ui/LiveDurationMs";
import type { Checkpoint } from "../domain/checkpoint";

interface CheckpointDetailPanelInfoProps {
	checkpoint: Checkpoint;
}

export function CheckpointDetailPanelInfo({
	checkpoint,
}: CheckpointDetailPanelInfoProps) {
	const canShowDuration = getCanShowDuration({
		status: checkpoint.status,
		startTime: checkpoint.startTime,
		durationMs: checkpoint.durationMs,
	});
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
				{canShowDuration && (
					<DetailRow label="Duration" className="tabular-nums">
						<LiveDurationMs
							status={checkpoint.status}
							startTime={checkpoint.startTime}
							endTime={checkpoint.endTime}
							durationMs={checkpoint.durationMs}
						/>
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
