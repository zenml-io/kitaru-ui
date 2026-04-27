import { Suspense } from "react";
import {
	getCheckpointDetailsPollingInterval,
	useCheckpointDetails,
} from "../business-logic/use-checkpoint-details";
import type { SelectedArtifact } from "../domain/checkpoint";
import { CheckpointMemoryTabContainer } from "@/modules/memory/feature/CheckpointMemoryTabContainer";
import { CheckpointDetailPanelArtifacts } from "../ui/CheckpointDetailPanelArtifacts";
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
	selectedArtifact: SelectedArtifact | null;
	onSelectArtifact: (artifact: SelectedArtifact | null) => void;
};

export function CheckpointDetailPanelContainer({
	checkpointId,
	activeTab,
	onTabChange,
	selectedArtifact,
	onSelectArtifact,
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
				selectedArtifact={selectedArtifact}
				onSelectArtifact={onSelectArtifact}
			/>
		</Suspense>
	);
}

function CheckpointDetailPanelContentContainer({
	checkpointId,
	activeTab,
	onTabChange,
	selectedArtifact,
	onSelectArtifact,
}: {
	checkpointId: string;
	activeTab: PanelTab;
	onTabChange: (tab: PanelTab) => void;
	selectedArtifact: SelectedArtifact | null;
	onSelectArtifact: (artifact: SelectedArtifact | null) => void;
}) {
	const { detailsData } = useCheckpointDetails(checkpointId, {
		refetchInterval: getCheckpointDetailsPollingInterval,
	});

	const inputs = detailsData?.inputs ?? [];
	const outputs = detailsData?.outputs ?? [];

	function handleTabChange(tab: PanelTab) {
		onTabChange(tab);
		if (tab === "artifacts" && !selectedArtifact) {
			const first = outputs[0] ?? inputs[0];
			if (first) {
				onSelectArtifact({
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
				{activeTab === "artifacts" && (
					<CheckpointDetailPanelArtifacts
						inputs={inputs}
						outputs={outputs}
						selectedArtifact={selectedArtifact}
						onSelectArtifact={(artifact, direction) =>
							onSelectArtifact({ artifact, direction })
						}
					/>
				)}
				{activeTab === "memory" && (
					<CheckpointMemoryTabContainer
						checkpointStartTime={detailsData?.startTime}
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
