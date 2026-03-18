import { Suspense } from "react";
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
import type { ArtifactEntry } from "../domain/checkpoint-artifacts";
import { useCheckpointArtifacts } from "../business-logic/use-checkpoint-artifacts";
import { ArtifactBlock } from "./ArtifactBlock";
import { ArtifactVisualization } from "./ArtifactVisualization";

interface CheckpointDetailPanelProps {
	checkpoint?: Checkpoint;
}

export function CheckpointDetailPanel({
	checkpoint,
}: CheckpointDetailPanelProps) {
	if (checkpoint === undefined) {
		return (
			<Empty className="h-full border-none">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<InfoCircle className="size-5" />
					</EmptyMedia>
					<EmptyDescription>
						Select a checkpoint to view details
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return <CheckpointDetailContent checkpoint={checkpoint} />;
}

function CheckpointDetailContent({ checkpoint }: { checkpoint: Checkpoint }) {
	const { artifactsData } = useCheckpointArtifacts(checkpoint.id);

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

			{artifactsData && (
				<>
					<ArtifactSection label="Inputs" entries={artifactsData.inputs} />
					<ArtifactSection label="Outputs" entries={artifactsData.outputs} />
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
	entries: ArtifactEntry[];
}) {
	if (entries.length === 0) return null;

	return (
		<div className="mt-4">
			<p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
				{label}
			</p>
			<div className="flex flex-col gap-1">
				{entries.map((entry) => (
					<ArtifactBlock key={entry.id} label={entry.name}>
						<Suspense
							fallback={
								<p className="text-muted-foreground text-xs">Loading…</p>
							}
						>
							<ArtifactVisualization artifactVersionId={entry.id} />
						</Suspense>
					</ArtifactBlock>
				))}
			</div>
		</div>
	);
}
