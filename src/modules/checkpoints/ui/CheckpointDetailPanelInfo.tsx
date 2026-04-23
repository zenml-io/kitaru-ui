import { getCanShowDuration } from "@/shared/business-logic/duration";
import { JsonTree } from "@/modules/executions/ui/traces/JsonTree";
import { DetailItem } from "@/shared/ui/detail-list/DetailItem";
import { DetailList } from "@/shared/ui/detail-list/DetailList";
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
			<DetailList>
				<DetailItem label="ID">
					<code className="font-mono">{checkpoint.id}</code>
				</DetailItem>
				<DetailItem label="Type">{checkpoint.type ?? "—"}</DetailItem>
				{checkpoint.status !== undefined && (
					<DetailItem label="Status" className="capitalize">
						{checkpoint.status}
					</DetailItem>
				)}
				{canShowDuration && (
					<DetailItem label="Duration" className="font-mono tabular-nums">
						<LiveDurationMs
							status={checkpoint.status}
							startTime={checkpoint.startTime}
							durationMs={checkpoint.durationMs}
						/>
					</DetailItem>
				)}
				{(checkpoint.inputs.length > 0 || checkpoint.outputs.length > 0) && (
					<>
						<DetailItem label="Inputs" className="font-mono tabular-nums">
							{checkpoint.inputs.length}
						</DetailItem>
						<DetailItem label="Outputs" className="font-mono tabular-nums">
							{checkpoint.outputs.length}
						</DetailItem>
					</>
				)}
			</DetailList>
			{checkpoint.runMetadata &&
				Object.keys(checkpoint.runMetadata).length > 0 && (
					<div className="space-y-2">
						<div className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
							Metadata
						</div>
						<JsonTree data={checkpoint.runMetadata} />
					</div>
				)}
		</div>
	);
}
