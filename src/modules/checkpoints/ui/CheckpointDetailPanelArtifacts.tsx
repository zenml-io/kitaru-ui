import { VisualizationErrorBoundary } from "@/modules/executions/ui/VisualizationErrorBoundary";
import { ArtifactChip } from "@/modules/executions/ui/traces/ArtifactChip";
import { Separator } from "@/shared/ui/separator";
import { Skeleton } from "@/shared/ui/skeleton";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { ArtifactEntry } from "../domain/checkpoint";
import { FullscreenArtifactButtonContainer } from "../feature/FullscreenArtifactButtonContainer";
import { ArtifactVisualizationContainer } from "../feature/ArtifactVisualizationContainer";
import { DownloadArtifactButtonContainer } from "../feature/DownloadArtifactButtonContainer";

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
	return (
		<div className="flex h-full flex-col">
			<ArtifactsToolbar
				inputs={inputs}
				outputs={outputs}
				selectedArtifact={selectedArtifact}
				onSelectArtifact={onSelectArtifact}
			/>
			{selectedArtifact ? (
				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
					<div className="bg-muted/50 flex items-center justify-between px-4 py-2">
						<span className="text-foreground truncate text-xs font-semibold">
							{selectedArtifact.artifact.name}
						</span>
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
						<ErrorBoundary FallbackComponent={VisualizationErrorBoundary}>
							<Suspense fallback={<VisualizationSkeleton />}>
								<ArtifactVisualizationContainer
									artifactVersionId={selectedArtifact.artifact.id}
								/>
							</Suspense>
						</ErrorBoundary>
					</div>
				</div>
			) : (
				<div className="flex flex-1 items-center justify-center p-4">
					<p className="text-muted-foreground text-xs">
						Select an artifact to view
					</p>
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

function VisualizationSkeleton() {
	return (
		<div className="flex flex-col gap-3 p-4">
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-4 w-1/2" />
			<Skeleton className="h-32 w-full" />
		</div>
	);
}

function ArtifactsToolbar({
	inputs,
	outputs,
	selectedArtifact,
	onSelectArtifact,
}: ArtifactsToolbarProps) {
	return (
		<div className="border-border flex shrink-0 flex-col gap-2 border-b px-4 py-3">
			{inputs.length > 0 && (
				<div className="flex items-center gap-1.5">
					<span className="text-2xs text-muted-foreground w-14 shrink-0 font-semibold tracking-wider uppercase">
						In ({inputs.length})
					</span>
					<div className="flex flex-wrap items-center gap-1">
						{inputs.map((a) => (
							<ArtifactChip
								key={a.id}
								name={a.name}
								isSelected={
									selectedArtifact?.artifact.id === a.id &&
									selectedArtifact?.direction === "input"
								}
								onClick={() => onSelectArtifact(a, "input")}
							/>
						))}
					</div>
				</div>
			)}
			{outputs.length > 0 && (
				<div className="flex items-center gap-1.5">
					<span className="text-2xs text-muted-foreground w-14 shrink-0 font-semibold tracking-wider uppercase">
						Out ({outputs.length})
					</span>
					<div className="flex flex-wrap items-center gap-1">
						{outputs.map((a) => (
							<ArtifactChip
								key={a.id}
								name={a.name}
								isSelected={
									selectedArtifact?.artifact.id === a.id &&
									selectedArtifact?.direction === "output"
								}
								onClick={() => onSelectArtifact(a, "output")}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
