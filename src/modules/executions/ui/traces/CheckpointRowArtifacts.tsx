import {
	getCheckpointDetailsPollingInterval,
	useCheckpointDetails,
} from "@/modules/checkpoints/business-logic/use-checkpoint-details";
import type { SelectedArtifact } from "@/modules/checkpoints/domain/checkpoint";
import { ArtifactVisualizationContainer } from "@/modules/checkpoints/feature/ArtifactVisualizationContainer";
import { FullscreenArtifactButtonContainer } from "@/modules/checkpoints/feature/FullscreenArtifactButtonContainer";
import { DownloadArtifactButtonContainer } from "@/modules/checkpoints/feature/DownloadArtifactButtonContainer";
import { ArrowRight } from "lucide-react";
import { Suspense, useState } from "react";
import { NoArtifactsMessage } from "@/modules/checkpoints/ui/NoArtifactsMessage";
import { Button } from "@/shared/ui/button";
import { TruncatedText } from "@/shared/ui/truncated-text";
import { ArtifactChip } from "./ArtifactChip";

type CheckpointRowArtifactsProps = {
	checkpointId: string;
	onViewArtifactInPanel: (selection: SelectedArtifact) => void;
};

function CheckpointRowArtifactsContent({
	checkpointId,
	onViewArtifactInPanel,
}: CheckpointRowArtifactsProps) {
	const { detailsData } = useCheckpointDetails(checkpointId, {
		refetchInterval: getCheckpointDetailsPollingInterval,
	});

	const { inputs, outputs } = detailsData;

	const [selected, setSelected] = useState<SelectedArtifact | null>(() =>
		outputs[0] ? { artifact: outputs[0], direction: "output" } : null
	);

	if (inputs.length === 0 && outputs.length === 0) {
		return <NoArtifactsMessage />;
	}

	return (
		<div className="space-y-4 px-4 pt-4 pb-4">
			<div className="flex flex-wrap items-center gap-3">
				{inputs.length > 0 && (
					<div className="flex items-center gap-1.5">
						<span className="text-2xs text-muted-foreground shrink-0 font-semibold tracking-wider uppercase">
							In ({inputs.length})
						</span>
						<div className="flex flex-wrap items-center gap-1">
							{inputs.map((a) => (
								<ArtifactChip
									key={a.id}
									name={a.name}
									isSelected={
										selected?.artifact.id === a.id &&
										selected.direction === "input"
									}
									onClick={() =>
										setSelected({ artifact: a, direction: "input" })
									}
								/>
							))}
						</div>
					</div>
				)}

				{inputs.length > 0 && outputs.length > 0 && (
					<ArrowRight className="text-muted-foreground size-3.5 shrink-0" />
				)}

				{outputs.length > 0 && (
					<div className="flex items-center gap-1.5">
						<span className="text-2xs text-muted-foreground shrink-0 font-semibold tracking-wider uppercase">
							Out ({outputs.length})
						</span>
						<div className="flex flex-wrap items-center gap-1">
							{outputs.map((a) => (
								<ArtifactChip
									key={a.id}
									name={a.name}
									isSelected={
										selected?.artifact.id === a.id &&
										selected.direction === "output"
									}
									onClick={() =>
										setSelected({ artifact: a, direction: "output" })
									}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{selected && (
				<div className="border-border overflow-hidden rounded-lg border">
					<div className="bg-muted/50 border-border flex items-center justify-between border-b px-4 py-2">
						<TruncatedText className="text-foreground text-xs font-semibold">
							{selected.artifact.name}
						</TruncatedText>
						<div className="flex items-center gap-1">
							<DownloadArtifactButtonContainer
								artifactVersionId={selected.artifact.id}
							/>
							<FullscreenArtifactButtonContainer
								artifactVersionId={selected.artifact.id}
								name={selected.artifact.name}
							/>
							<Button
								variant="ghost"
								size="xs"
								className="text-muted-foreground text-2xs"
								onClick={() => onViewArtifactInPanel(selected)}
							>
								View in panel
								<ArrowRight />
							</Button>
						</div>
					</div>
					<div className="bg-background">
						<ArtifactVisualizationContainer
							artifactVersionId={selected.artifact.id}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export function CheckpointRowArtifacts({
	checkpointId,
	onViewArtifactInPanel,
}: CheckpointRowArtifactsProps) {
	return (
		<Suspense
			fallback={
				<p className="text-2xs text-muted-foreground px-4 py-3">Loading…</p>
			}
		>
			<CheckpointRowArtifactsContent
				checkpointId={checkpointId}
				onViewArtifactInPanel={onViewArtifactInPanel}
			/>
		</Suspense>
	);
}
