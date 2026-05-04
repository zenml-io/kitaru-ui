import { Suspense, useState } from "react";
import {
	getCheckpointDetailsPollingInterval,
	useCheckpointDetails,
} from "../business-logic/use-checkpoint-details";
import type { ArtifactEntry } from "../domain/checkpoint";
import { CheckpointDetailPanelArtifacts } from "../ui/CheckpointDetailPanelArtifacts";
import { CheckpointDetailPanelSourceCode } from "../ui/CheckpointDetailPanelSourceCode";
import { CheckpointDetailPanelHeader } from "../ui/CheckpointDetailPanelHeader";
import { CheckpointDetailPanelInfo } from "../ui/CheckpointDetailPanelInfo";
import {
	CheckpointDetailPanelTabs,
	type PanelTab,
} from "../ui/CheckpointDetailPanelTabs";
import { CheckpointDetailPanelSkeleton } from "../ui/CheckpointDetailPanelSkeleton";
import { CheckpointDetailsEmptyView } from "../ui/CheckpointDetailsEmptyView";
import { CheckpointLogsTabContainer } from "./CheckpointLogsTabContainer";

type CheckpointDetailPanelContainerProps = {
	checkpointId?: string;
	activeTab: PanelTab;
	onTabChange: (tab: PanelTab) => void;
};

export function CheckpointDetailPanelContainer({
	checkpointId,
	activeTab,
	onTabChange,
}: CheckpointDetailPanelContainerProps) {
	if (!checkpointId) {
		return <CheckpointDetailsEmptyView />;
	}

	return (
		<Suspense fallback={<CheckpointDetailPanelSkeleton />}>
			<CheckpointDetailPanelContentContainer
				checkpointId={checkpointId}
				activeTab={activeTab}
				onTabChange={onTabChange}
			/>
		</Suspense>
	);
}

function CheckpointDetailPanelContentContainer({
	checkpointId,
	activeTab,
	onTabChange,
}: {
	checkpointId: string;
	activeTab: PanelTab;
	onTabChange: (tab: PanelTab) => void;
}) {
	const { detailsData } = useCheckpointDetails(checkpointId, {
		refetchInterval: getCheckpointDetailsPollingInterval,
	});

	const inputs = detailsData?.inputs ?? [];
	const outputs = detailsData?.outputs ?? [];

	const [selectedArtifact, setSelectedArtifact] = useState<{
		artifact: ArtifactEntry;
		direction: "input" | "output";
	} | null>(null);

	function handleTabChange(tab: PanelTab) {
		onTabChange(tab);
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

	return (
		<div className="flex h-full flex-col">
			<div className="border-border bg-card shrink-0 border-b">
				<CheckpointDetailPanelHeader checkpoint={detailsData} />
				<CheckpointDetailPanelTabs
					activeTab={activeTab}
					onTabChange={handleTabChange}
				/>
			</div>
			<div className="min-h-0 flex-1 overflow-y-auto">
				{activeTab === "checkpoint" && (
					<CheckpointDetailPanelInfo checkpoint={detailsData} />
				)}
				{activeTab === "code" && (
					<CheckpointDetailPanelSourceCode source={detailsData.source} />
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
				{activeTab === "logs" && (
					<CheckpointLogsTabContainer
						checkpointId={checkpointId}
						logSources={detailsData?.logSources ?? []}
						checkpointStatus={detailsData?.status}
					/>
				)}
			</div>
		</div>
	);
}
