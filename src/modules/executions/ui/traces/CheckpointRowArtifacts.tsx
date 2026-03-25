import {
	getCheckpointDetailsPollingInterval,
	useCheckpointDetails,
} from "@/modules/checkpoints/business-logic/use-checkpoint-details";
import type { ArtifactEntry } from "@/modules/checkpoints/domain/checkpoint";
import { ArtifactVisualizationContainer } from "@/modules/checkpoints/feature/ArtifactVisualizationContainer";
import { FullscreenArtifactButtonContainer } from "@/modules/checkpoints/feature/FullscreenArtifactButtonContainer";
import { DownloadArtifactButtonContainer } from "@/modules/checkpoints/feature/DownloadArtifactButtonContainer";
import { ArrowRight } from "@untitledui/icons";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VisualizationErrorBoundary } from "../VisualizationErrorBoundary";
import { ArtifactChip } from "./ArtifactChip";

function CheckpointRowArtifactsContent({
	checkpointId,
}: {
	checkpointId: string;
}) {
	const { detailsData } = useCheckpointDetails(checkpointId, {
		refetchInterval: getCheckpointDetailsPollingInterval,
	});

	const { inputs, outputs } = detailsData;

	const [selected, setSelected] = useState<{
		entry: ArtifactEntry;
		direction: "input" | "output";
	} | null>(() =>
		outputs[0] ? { entry: outputs[0], direction: "output" } : null
	);

	if (inputs.length === 0 && outputs.length === 0) return null;

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
										selected?.entry.id === a.id &&
										selected.direction === "input"
									}
									onClick={() => setSelected({ entry: a, direction: "input" })}
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
										selected?.entry.id === a.id &&
										selected.direction === "output"
									}
									onClick={() => setSelected({ entry: a, direction: "output" })}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{selected && (
				<div className="border-border overflow-hidden rounded-lg border">
					<div className="bg-muted/50 border-border flex items-center justify-between border-b px-4 py-2">
						<span className="text-foreground truncate text-xs font-semibold">
							{selected.entry.name}
						</span>
						<div className="flex items-center gap-1">
							<DownloadArtifactButtonContainer
								artifactVersionId={selected.entry.id}
							/>
							<FullscreenArtifactButtonContainer
								artifactVersionId={selected.entry.id}
								name={selected.entry.name}
							/>
						</div>
					</div>
					<div className="bg-background">
						<ErrorBoundary FallbackComponent={VisualizationErrorBoundary}>
							<Suspense
								fallback={
									<p className="text-2xs text-muted-foreground px-4 py-3">
										Loading…
									</p>
								}
							>
								<ArtifactVisualizationContainer
									artifactVersionId={selected.entry.id}
								/>
							</Suspense>
						</ErrorBoundary>
					</div>
				</div>
			)}
		</div>
	);
}

export function CheckpointRowArtifacts({
	checkpointId,
}: {
	checkpointId: string;
}) {
	return (
		<Suspense
			fallback={
				<p className="text-2xs text-muted-foreground px-4 py-3">Loading…</p>
			}
		>
			<CheckpointRowArtifactsContent checkpointId={checkpointId} />
		</Suspense>
	);
}
