import { ArtifactChip } from "@/modules/executions/ui/traces/ArtifactChip";
import { ViewerFrameFullHeight } from "@/modules/executions/ui/traces/ViewerFrame";
import { ChipBar } from "@/shared/ui/ChipBar";
import { Separator } from "@zenml/hashi/primitives/separator";
import { TruncatedText } from "@/shared/ui/truncated-text";
import type { ArtifactEntry } from "../domain/checkpoint";
import { FullscreenArtifactButtonContainer } from "../feature/FullscreenArtifactButtonContainer";
import { ArtifactVisualizationContainer } from "../feature/ArtifactVisualizationContainer";
import { DownloadArtifactButtonContainer } from "../feature/DownloadArtifactButtonContainer";
import { NoArtifactsMessage } from "./NoArtifactsMessage";

type SelectedArtifact = {
	artifact: ArtifactEntry;
	direction: "input" | "output";
};

type CheckpointDetailPanelArtifactsProps = {
	inputs: ArtifactEntry[];
	outputs: ArtifactEntry[];
	selectedArtifact: SelectedArtifact | null;
	onSelectArtifact: (
		artifact: ArtifactEntry,
		direction: "input" | "output"
	) => void;
};

export function CheckpointDetailPanelArtifacts({
	inputs,
	outputs,
	selectedArtifact,
	onSelectArtifact,
}: CheckpointDetailPanelArtifactsProps) {
	const hasVisibleArtifacts = inputs.length > 0 || outputs.length > 0;

	return (
		<div className="flex h-full flex-col">
			{hasVisibleArtifacts && (
				<ArtifactsToolbar
					inputs={inputs}
					outputs={outputs}
					selectedArtifact={selectedArtifact}
					onSelectArtifact={onSelectArtifact}
				/>
			)}
			{!hasVisibleArtifacts && <NoArtifactsMessage />}
			{hasVisibleArtifacts && !selectedArtifact && (
				<div className="flex flex-1 items-center justify-center p-4">
					<p className="text-muted-foreground text-xs">
						Select an artifact to view
					</p>
				</div>
			)}
			{hasVisibleArtifacts && selectedArtifact && (
				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
					<div className="bg-muted/50 flex items-center justify-between px-4 py-2">
						<TruncatedText className="text-foreground text-xs font-semibold">
							{selectedArtifact.artifact.name}
						</TruncatedText>
						<div className="flex items-center gap-1">
							<DownloadArtifactButtonContainer
								artifactVersionId={selectedArtifact.artifact.id}
							/>
							<FullscreenArtifactButtonContainer
								artifactVersionId={selectedArtifact.artifact.id}
								name={selectedArtifact.artifact.name}
							/>
						</div>
					</div>
					<Separator />
					<div className="bg-background flex-1">
						<ViewerFrameFullHeight>
							<ArtifactVisualizationContainer
								artifactVersionId={selectedArtifact.artifact.id}
							/>
						</ViewerFrameFullHeight>
					</div>
				</div>
			)}
		</div>
	);
}

type ArtifactsToolbarProps = {
	inputs: ArtifactEntry[];
	outputs: ArtifactEntry[];
	selectedArtifact: SelectedArtifact | null;
	onSelectArtifact: (
		artifact: ArtifactEntry,
		direction: "input" | "output"
	) => void;
};

function ArtifactsToolbar({
	inputs,
	outputs,
	selectedArtifact,
	onSelectArtifact,
}: ArtifactsToolbarProps) {
	return (
		<ChipBar
			groups={[
				...(inputs.length > 0
					? [
							{
								label: `In (${inputs.length})`,
								children: inputs.map((a) => (
									<ArtifactChip
										key={a.id}
										name={a.name}
										isSelected={
											selectedArtifact?.artifact.id === a.id &&
											selectedArtifact?.direction === "input"
										}
										onClick={() => onSelectArtifact(a, "input")}
									/>
								)),
							},
						]
					: []),
				...(outputs.length > 0
					? [
							{
								label: `Out (${outputs.length})`,
								children: outputs.map((a) => (
									<ArtifactChip
										key={a.id}
										name={a.name}
										isSelected={
											selectedArtifact?.artifact.id === a.id &&
											selectedArtifact?.direction === "output"
										}
										onClick={() => onSelectArtifact(a, "output")}
									/>
								)),
							},
						]
					: []),
			]}
		/>
	);
}
