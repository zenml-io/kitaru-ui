import { Suspense, useMemo, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";
import { useFlow } from "@/modules/flows/business-logic/use-flow";
import { ArtifactVisualizationContainer } from "@/modules/checkpoints/feature/ArtifactVisualizationContainer";
import { useCheckpointMemories } from "../business-logic/use-checkpoint-memories";
import { MemoryMetadata } from "../ui/MemoryMetadata";
import { CheckpointMemoryTab } from "../ui/CheckpointMemoryTab";
import { MemoryEmptyState } from "../ui/MemoryEmptyState";
import { MemoryErrorState } from "../ui/MemoryErrorState";
import { VisualizationSkeleton } from "@/modules/checkpoints/ui/VisualizationSkeleton";

type CheckpointMemoryTabContainerProps = {
	checkpointStartTime?: Date;
};

export function CheckpointMemoryTabContainer({
	checkpointStartTime,
}: CheckpointMemoryTabContainerProps) {
	const { flowId, executionId } = useParams({
		from: "/_private/_navbar/flows/$flowId/executions/$executionId",
	});
	const { flowData } = useFlow(flowId);

	const {
		entries: memoryEntries,
		isError,
		error,
	} = useCheckpointMemories(flowData.name, executionId, checkpointStartTime);

	const [userSelectedId, setUserSelectedId] = useState<string | undefined>();

	const selectedEntry = useMemo(() => {
		if (userSelectedId) {
			const found = memoryEntries.find((e) => e.artifactId === userSelectedId);
			if (found) return found;
		}
		return memoryEntries[0];
	}, [userSelectedId, memoryEntries]);

	if (isError) {
		return <MemoryErrorState error={error} />;
	}

	return (
		<CheckpointMemoryTab
			entries={memoryEntries}
			selectedArtifactId={selectedEntry?.artifactId}
			onSelectEntry={(entry) => setUserSelectedId(entry.artifactId)}
		>
			{selectedEntry && (
				<>
					<div className="border-border border-b px-4 py-3">
						<MemoryMetadata entry={selectedEntry} />
					</div>
					<ErrorBoundary
						key={selectedEntry.artifactId}
						fallback={<MemoryEmptyState variant="no-preview" />}
					>
						<Suspense fallback={<VisualizationSkeleton />}>
							<ArtifactVisualizationContainer
								artifactVersionId={selectedEntry.artifactId}
							/>
						</Suspense>
					</ErrorBoundary>
				</>
			)}
		</CheckpointMemoryTab>
	);
}
