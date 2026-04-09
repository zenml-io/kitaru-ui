import { Suspense, useMemo, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useFlow } from "@/modules/flows/business-logic/use-flow";
import { ArtifactVisualizationContainer } from "@/modules/checkpoints/feature/ArtifactVisualizationContainer";
import { useExecutionMemories } from "../business-logic/use-execution-memories";
import { MemoryMetadata } from "../ui/MemoryMetadata";
import { CheckpointMemoryTab } from "../ui/CheckpointMemoryTab";

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

	const { namespaceEntries, flowEntries, executionEntries } =
		useExecutionMemories(flowData.name, executionId);

	const memoryEntries = useMemo(() => {
		const all = [...namespaceEntries, ...flowEntries, ...executionEntries];
		if (!checkpointStartTime) return all;
		return all.filter((e) => e.createdAt <= checkpointStartTime);
	}, [namespaceEntries, flowEntries, executionEntries, checkpointStartTime]);

	const [userSelectedId, setUserSelectedId] = useState<string | undefined>();

	const selectedEntry = useMemo(() => {
		if (userSelectedId) {
			const found = memoryEntries.find((e) => e.artifactId === userSelectedId);
			if (found) return found;
		}
		return executionEntries[0] ?? flowEntries[0] ?? namespaceEntries[0];
	}, [
		userSelectedId,
		memoryEntries,
		executionEntries,
		flowEntries,
		namespaceEntries,
	]);

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
					<Suspense>
						<ArtifactVisualizationContainer
							artifactVersionId={selectedEntry.artifactId}
						/>
					</Suspense>
				</>
			)}
		</CheckpointMemoryTab>
	);
}
