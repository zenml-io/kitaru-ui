import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
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
import { CheckpointLogsContainer } from "./CheckpointLogsContainer";
import { ErrorFallback } from "@/shared/ui/ErrorFallback";
import { LogsListSkeleton } from "@/modules/logs/ui/LogsListSkeleton";

type CheckpointDetailPanelContainerProps = {
	checkpointId?: string;
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

	const inputs = detailsData?.inputs ?? [];
	const outputs = detailsData?.outputs ?? [];

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
							setSelectedArtifact({ artifact, direction })
						}
					/>
				)}
				{activeTab === "memory" && (
					<CheckpointMemoryTabContainer
						checkpointStartTime={detailsData?.startTime}
					/>
				)}
				{activeTab === "logs" && (
					<ErrorBoundary
						key={checkpointId}
						fallbackRender={(props) => (
							<ErrorFallback {...props} title="Failed to load logs" />
						)}
					>
						<Suspense fallback={<LogsListSkeleton />}>
							<CheckpointLogsContainer
								checkpointId={checkpointId}
								logSources={detailsData?.logSources ?? []}
								checkpointStatus={detailsData?.status}
							/>
						</Suspense>
					</ErrorBoundary>
				)}
			</div>
		</div>
	);
}
