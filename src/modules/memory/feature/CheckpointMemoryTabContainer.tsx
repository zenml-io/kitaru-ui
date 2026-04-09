import { Suspense, useMemo, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useFlow } from "@/modules/flows/business-logic/use-flow";
import { ArtifactVisualizationContainer } from "@/modules/checkpoints/feature/ArtifactVisualizationContainer";
import { useExecutionMemories } from "../business-logic/use-execution-memories";
import { MemoryMetadata } from "../ui/MemoryMetadata";
import { CheckpointMemoryTab } from "../ui/CheckpointMemoryTab";

export function CheckpointMemoryTabContainer() {
	const { flowId, executionId } = useParams({
		from: "/_private/_navbar/flows/$flowId/executions/$executionId",
	});
	const { flowData } = useFlow(flowId);

	const { namespaceEntries, flowEntries, executionEntries } =
		useExecutionMemories(flowData.name, executionId);

	const memoryEntries = useMemo(
		() => [...namespaceEntries, ...flowEntries, ...executionEntries],
		[namespaceEntries, flowEntries, executionEntries]
	);

	const [userSelectedKey, setUserSelectedKey] = useState<string | undefined>();

	const selectedKey = useMemo(() => {
		if (
			userSelectedKey &&
			memoryEntries.some((e) => e.key === userSelectedKey)
		) {
			return userSelectedKey;
		}
		const first = executionEntries[0] ?? flowEntries[0] ?? namespaceEntries[0];
		return first?.key;
	}, [
		userSelectedKey,
		memoryEntries,
		executionEntries,
		flowEntries,
		namespaceEntries,
	]);

	const selectedEntry = memoryEntries.find((e) => e.key === selectedKey);

	return (
		<CheckpointMemoryTab
			entries={memoryEntries}
			selectedKey={selectedKey}
			onSelectKey={setUserSelectedKey}
		>
			{selectedEntry && (
				<>
					<div className="border-border border-b px-4 py-3">
						<MemoryMetadata entry={selectedEntry} flowId={flowId} />
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
