import { InfoCircle } from "@untitledui/icons";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
} from "@/shared/ui/empty";
import { formatDurationShort } from "@/shared/utils/time";
import { StatusDot, type StatusDotVariant } from "@/shared/ui/StatusDot";
import type { Checkpoint } from "../domain/checkpoint";
import type { CheckpointArtifacts } from "../domain/checkpoint-artifacts";
import { ArtifactBlock } from "./ArtifactBlock";
import { JsonViewer } from "./JsonViewer";

interface CheckpointDetailPanelProps {
	checkpoint?: Checkpoint;
	artifacts: CheckpointArtifacts | null;
	isLoadingArtifacts: boolean;
}

export function CheckpointDetailPanel({
	checkpoint,
	artifacts,
	isLoadingArtifacts,
}: CheckpointDetailPanelProps) {
	if (checkpoint === undefined) {
		return (
			<Empty className="h-full border-none">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<InfoCircle className="size-5" />
					</EmptyMedia>
					<EmptyDescription>Select a step to view details</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="p-4">
			<p className="font-mono text-sm font-semibold break-all">
				{checkpoint.name}
			</p>
			<div className="mt-4 flex flex-col divide-y">
				<div className="flex items-center justify-between py-2">
					<span className="text-muted-foreground text-xs">Status</span>
					<div className="flex items-center gap-1.5">
						<StatusDot status={checkpoint.status as StatusDotVariant} />
						<span className="text-xs capitalize">{checkpoint.status}</span>
					</div>
				</div>
				<div className="flex items-center justify-between py-2">
					<span className="text-muted-foreground text-xs">Duration</span>
					<span className="font-mono text-xs">
						{checkpoint.durationMs > 0
							? formatDurationShort(checkpoint.durationMs)
							: "—"}
					</span>
				</div>
			</div>

			{isLoadingArtifacts && (
				<p className="text-muted-foreground mt-4 text-xs">Loading artifacts…</p>
			)}

			{artifacts && (
				<>
					<ArtifactSection label="Inputs" entries={artifacts.inputs} />
					<ArtifactSection label="Outputs" entries={artifacts.outputs} />
				</>
			)}
		</div>
	);
}

function ArtifactSection({
	label,
	entries,
}: {
	label: string;
	entries: Record<string, unknown>;
}) {
	const keys = Object.keys(entries);
	if (keys.length === 0) return null;

	return (
		<div className="mt-4">
			<p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
				{label}
			</p>
			<div className="flex flex-col gap-1">
				{keys.map((key) => (
					<ArtifactBlock
						key={key}
						label={key}
						copyText={JSON.stringify(entries[key], null, 2)}
					>
						<JsonViewer data={entries[key]} />
					</ArtifactBlock>
				))}
			</div>
		</div>
	);
}
