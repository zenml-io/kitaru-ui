import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckpointDetailsEmptyView } from "../ui/CheckpointDetailsEmptyView";
import { CheckpointDetailPanelHeader } from "../ui/CheckpointDetailPanelHeader";
import {
	CheckpointDetailPanelTabs,
	type PanelTab,
} from "../ui/CheckpointDetailPanelTabs";
import { CheckpointDetailPanelInfo } from "../ui/CheckpointDetailPanelInfo";
import { CheckpointDetailPanelArtifacts } from "../ui/CheckpointDetailPanelArtifacts";
import { checkpointsQueries } from "../business-logic/checkpoints-queries";
import type { Checkpoint } from "../domain/checkpoint";
import type { ArtifactEntry } from "../domain/checkpoint-artifacts";

type CheckpointDetailPanelContainerProps = {
	checkpoint?: Checkpoint;
};

export function CheckpointDetailPanelContainer({
	checkpoint,
}: CheckpointDetailPanelContainerProps) {
	const { data: artifactsData } = useQuery({
		...checkpointsQueries.artifacts(checkpoint?.id ?? ""),
		enabled: !!checkpoint,
	});

	const inputs = artifactsData?.inputs ?? [];
	const outputs = artifactsData?.outputs ?? [];

	const [activeTab, setActiveTab] = useState<PanelTab>("checkpoint");
	const [selectedArtifact, setSelectedArtifact] = useState<{
		artifact: ArtifactEntry;
		direction: "input" | "output";
	} | null>(null);

	function handleTabChange(tab: PanelTab) {
		setActiveTab(tab);
		if (tab === "artifacts" && !selectedArtifact) {
			const first = outputs[0] ?? inputs[0];
			if (first) {
				setSelectedArtifact({
					artifact: first,
					direction: outputs[0] ? "output" : "input",
				});
			}
		}
	}

	if (!checkpoint) {
		return <CheckpointDetailsEmptyView />;
	}

	return (
		<div className="flex h-full flex-col">
			<CheckpointDetailPanelHeader checkpoint={checkpoint} />
			<CheckpointDetailPanelTabs
				activeTab={activeTab}
				onTabChange={handleTabChange}
			/>
			<div className="min-h-0 flex-1 overflow-y-auto">
				{activeTab === "checkpoint" && (
					<CheckpointDetailPanelInfo
						checkpoint={checkpoint}
						inputs={inputs}
						outputs={outputs}
					/>
				)}
				{activeTab === "artifacts" && (
					<CheckpointDetailPanelArtifacts
						inputs={inputs}
						outputs={outputs}
						selectedArtifact={selectedArtifact}
						onSelectArtifact={(artifact, direction) =>
							setSelectedArtifact({ artifact, direction })
						}
					/>
				)}
			</div>
		</div>
	);
}
