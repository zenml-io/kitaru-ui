import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useFlow } from "@/modules/flows/business-logic/use-flow";
import { useFlowMemories } from "@/modules/memory/business-logic/use-flow-memories";
import { useMemoryHistory } from "@/modules/memory/business-logic/use-memory-history";
import { useManualRefresh } from "@/shared/business-logic/use-manual-refresh";
import { ThreePanelLayout } from "@/shared/ui/ThreePanelLayout";
import {
	ThreePanelLayoutProvider,
	ToggleLeftPanelButton,
	ToggleRightPanelButton,
} from "@/shared/ui/ThreePanelLayoutContext";
import { ArtifactVisualizationContainer } from "@/modules/checkpoints/feature/ArtifactVisualizationContainer";
import { DownloadArtifactButtonContainer } from "@/modules/checkpoints/feature/DownloadArtifactButtonContainer";
import { deriveScopesFromEntries } from "../business-logic/memory-operations";
import type { MemoryEntry, MemoryScopeInfo } from "../domain/memory";
import { MemorySidebar } from "../ui/MemorySidebar";
import { MemoryCenterPanel } from "../ui/MemoryCenterPanel";
import { MemoryHistorySidePanel } from "../ui/MemoryHistorySidePanel";
import { MemoryEmptyState } from "../ui/MemoryEmptyState";
import { MemoryToolbar } from "../ui/MemoryToolbar";

export function FlowMemoryContainer() {
	const { flowId } = useParams({
		from: "/_private/_navbar/flows/$flowId",
	});

	const { flowData } = useFlow(flowId);
	const flowName = flowData.name;

	const [activeScope, setActiveScope] = useState<MemoryScopeInfo>({
		scope: flowId,
		label: flowName,
		scopeType: "flow",
		entryCount: 0,
	});

	const [userSelectedKey, setUserSelectedKey] = useState<string | undefined>();
	const [selectedVersion, setSelectedVersion] = useState<string | undefined>();

	const {
		namespaceEntries,
		flowEntries,
		executionEntries,
		isPending: isEntriesPending,
		isError: isEntriesError,
		error: entriesError,
		refetch: refetchEntries,
	} = useFlowMemories(flowId, flowName);

	const memoryScopesData = deriveScopesFromEntries(
		namespaceEntries,
		flowEntries,
		executionEntries,
		flowId,
		flowName
	);

	const memoryEntriesData = [
		...namespaceEntries,
		...flowEntries,
		...executionEntries,
	].filter(
		(e) =>
			e.scope === activeScope.scope && e.scopeType === activeScope.scopeType
	);

	// Derive effective selected key: use user's choice if valid, else first entry
	const selectedKey =
		memoryEntriesData.length === 0
			? undefined
			: userSelectedKey !== undefined &&
				  memoryEntriesData.some((e) => e.key === userSelectedKey)
				? userSelectedKey
				: memoryEntriesData[0].key;

	const {
		memoryHistoryData,
		isPending: isHistoryPending,
		refetch: refetchHistory,
	} = useMemoryHistory(activeScope.scope, activeScope.scopeType, selectedKey);

	const enrichedMemoryHistoryData = memoryHistoryData?.map((entry) => {
		if (entry.scopeType === "flow") {
			return {
				...entry,
				scopeLabel: entry.scopeLabel ?? activeScope.label,
			};
		}
		return entry;
	});

	const handleScopeChange = (scope: MemoryScopeInfo) => {
		setActiveScope(scope);
		setUserSelectedKey(undefined);
		setSelectedVersion(undefined);
	};

	const handleSelectKey = (key: string) => {
		setUserSelectedKey(key);
		setSelectedVersion(undefined);
	};

	// Manual refresh
	const { refresh, isPending: isRefreshing } = useManualRefresh(async () => {
		await Promise.all([
			refetchEntries(),
			...(selectedKey ? [refetchHistory()] : []),
		]);
	});

	// Derive the entry to show in the detail panel
	const selectedListEntry = memoryEntriesData.find(
		(e) => e.key === selectedKey
	);
	const selectedHistoryEntry = selectedVersion
		? enrichedMemoryHistoryData?.find((e) => e.version === selectedVersion)
		: enrichedMemoryHistoryData?.[0];
	const detailEntry: MemoryEntry | undefined =
		selectedHistoryEntry ?? selectedListEntry;

	const isFlowScope =
		activeScope.scope === flowId && activeScope.scopeType === "flow";

	const preview = detailEntry?.isDeleted ? (
		<MemoryEmptyState variant="no-preview" />
	) : detailEntry ? (
		<ArtifactVisualizationContainer
			artifactVersionId={detailEntry.artifactId}
		/>
	) : null;

	const previewActions = detailEntry ? (
		<DownloadArtifactButtonContainer
			artifactVersionId={detailEntry.artifactId}
		/>
	) : null;

	return (
		<ThreePanelLayoutProvider>
			<ThreePanelLayout
				left={
					<MemorySidebar
						scopes={memoryScopesData}
						activeScope={activeScope}
						flowId={flowId}
						onScopeChange={handleScopeChange}
						entries={memoryEntriesData}
						selectedKey={selectedKey}
						onSelectKey={handleSelectKey}
						isEntriesPending={isEntriesPending}
					/>
				}
				center={
					<>
						<div className="border-border flex shrink-0 items-center gap-2 border-b p-2">
							<ToggleLeftPanelButton
								ariaLabel={(open) =>
									open ? "Close memory scopes" : "Open memory scopes"
								}
							/>
							<MemoryToolbar
								selectedKey={selectedKey}
								selectedEntry={detailEntry}
								selectedVersion={selectedVersion}
								history={enrichedMemoryHistoryData}
								onSelectVersion={setSelectedVersion}
								isRefreshing={isRefreshing}
								onRefresh={refresh}
							/>
							<ToggleRightPanelButton
								ariaLabel={(open) =>
									open ? "Close version history" : "Open version history"
								}
							/>
						</div>
						<MemoryCenterPanel
							isPending={isEntriesPending}
							isError={isEntriesError}
							error={entriesError}
							isEmpty={memoryEntriesData.length === 0}
							isFlowScope={isFlowScope}
							scopeName={activeScope.label ?? activeScope.scope}
							detailEntry={detailEntry}
							preview={preview}
							previewActions={previewActions}
						/>
					</>
				}
				right={
					<MemoryHistorySidePanel
						selectedKey={selectedKey}
						isPending={isHistoryPending}
						history={enrichedMemoryHistoryData}
						selectedVersion={selectedVersion}
						onSelectVersion={setSelectedVersion}
					/>
				}
			/>
		</ThreePanelLayoutProvider>
	);
}
