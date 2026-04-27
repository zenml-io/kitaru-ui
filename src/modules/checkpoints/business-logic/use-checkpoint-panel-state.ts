import { useState } from "react";
import { useThreePanelLayout } from "@/shared/ui/ThreePanelLayoutContext";
import type {
	ArtifactPanelTarget,
	SelectedArtifact,
} from "../domain/checkpoint";
import type { PanelTab } from "../ui/CheckpointDetailPanelTabs";

export function useCheckpointPanelState() {
	const { expandRight } = useThreePanelLayout();

	const [selectedCheckpointId, setSelectedCheckpointId] = useState<
		string | undefined
	>();
	const [activeTab, setActiveTab] = useState<PanelTab>("logs");
	const [selectedArtifact, setSelectedArtifact] =
		useState<SelectedArtifact | null>(null);

	const selectCheckpoint = (id: string) => {
		if (id !== selectedCheckpointId) {
			setSelectedArtifact(null);
		}
		setSelectedCheckpointId(id);
	};

	const viewArtifactInPanel = ({
		checkpointId,
		artifact,
		direction,
	}: ArtifactPanelTarget) => {
		setSelectedCheckpointId(checkpointId);
		setActiveTab("artifacts");
		setSelectedArtifact({ artifact, direction });
		expandRight();
	};

	return {
		selectedCheckpointId,
		activeTab,
		setActiveTab,
		selectedArtifact,
		setSelectedArtifact,
		selectCheckpoint,
		viewArtifactInPanel,
	};
}
