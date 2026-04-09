import { Suspense, useEffect, useReducer, useState } from "react";
import {
	getCheckpointDetailsPollingInterval,
	useCheckpointDetails,
} from "../business-logic/use-checkpoint-details";
import type { ArtifactEntry } from "../domain/checkpoint";
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

type CheckpointDetailPanelContainerProps = {
	checkpointId?: string;
};

type SelectedArtifact = {
	artifact: ArtifactEntry;
	direction: "input" | "output";
};

const emptyArtifactEntries: ArtifactEntry[] = [];

type SelectedArtifactAction =
	| {
			type: "select";
			artifact: ArtifactEntry;
			direction: "input" | "output";
	  }
	| {
			type: "sync";
			activeTab: PanelTab;
			inputs: ArtifactEntry[];
			outputs: ArtifactEntry[];
	  };

export function CheckpointDetailPanelContainer({
	checkpointId,
}: CheckpointDetailPanelContainerProps) {
	if (!checkpointId) {
		return <CheckpointDetailsEmptyView />;
	}

	return (
		<Suspense fallback={<CheckpointDetailPanelSkeleton />}>
			<CheckpointDetailPanelContentContainer checkpointId={checkpointId} />
		</Suspense>
	);
}

function CheckpointDetailPanelContentContainer({
	checkpointId,
}: {
	checkpointId: string;
}) {
	const { detailsData } = useCheckpointDetails(checkpointId, {
		refetchInterval: getCheckpointDetailsPollingInterval,
	});

	const inputs = detailsData?.inputs ?? emptyArtifactEntries;
	const outputs = detailsData?.outputs ?? emptyArtifactEntries;

	const [activeTab, setActiveTab] = useState<PanelTab>("checkpoint");
	const [selectedArtifact, dispatchSelectedArtifact] = useReducer(
		selectedArtifactReducer,
		null
	);

	useEffect(() => {
		dispatchSelectedArtifact({
			type: "sync",
			activeTab,
			inputs,
			outputs,
		});
	}, [activeTab, inputs, outputs]);

	function handleTabChange(tab: PanelTab) {
		setActiveTab(tab);
	}

	return (
		<div className="flex h-full flex-col">
			<CheckpointDetailPanelHeader checkpoint={detailsData} />
			<CheckpointDetailPanelTabs
				activeTab={activeTab}
				onTabChange={handleTabChange}
			/>
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
							dispatchSelectedArtifact({
								type: "select",
								artifact,
								direction,
							})
						}
					/>
				)}
				{activeTab === "memory" && (
					<CheckpointMemoryTabContainer
						checkpointStartTime={detailsData?.startTime}
					/>
				)}
			</div>
		</div>
	);
}

function getDefaultSelectedArtifact(
	inputs: ArtifactEntry[],
	outputs: ArtifactEntry[]
): SelectedArtifact | null {
	const firstOutput = outputs[0];
	if (firstOutput) {
		return {
			artifact: firstOutput,
			direction: "output",
		};
	}

	const firstInput = inputs[0];
	if (firstInput) {
		return {
			artifact: firstInput,
			direction: "input",
		};
	}

	return null;
}

function selectedArtifactReducer(
	selectedArtifact: SelectedArtifact | null,
	action: SelectedArtifactAction
): SelectedArtifact | null {
	if (action.type === "select") {
		return {
			artifact: action.artifact,
			direction: action.direction,
		};
	}

	if (
		selectedArtifact &&
		isArtifactVisible(selectedArtifact, action.inputs, action.outputs)
	) {
		return selectedArtifact;
	}

	if (action.activeTab === "artifacts") {
		return getDefaultSelectedArtifact(action.inputs, action.outputs);
	}

	return null;
}

function isArtifactVisible(
	selectedArtifact: SelectedArtifact,
	inputs: ArtifactEntry[],
	outputs: ArtifactEntry[]
): boolean {
	const candidates = selectedArtifact.direction === "output" ? outputs : inputs;
	return candidates.some(
		(artifact) => artifact.id === selectedArtifact.artifact.id
	);
}
