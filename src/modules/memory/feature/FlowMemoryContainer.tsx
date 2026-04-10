import { Suspense, useCallback, useMemo, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";
import { useFlow } from "@/modules/flows/business-logic/use-flow";
import { useFlowMemories } from "@/modules/memory/business-logic/use-flow-memories";
import { useMemoryHistory } from "@/modules/memory/business-logic/use-memory-history";
import { useManualRefresh } from "@/shared/business-logic/use-manual-refresh";
import { ThreePanelLayout } from "@/shared/ui/ThreePanelLayout";
import { ArtifactVisualizationContainer } from "@/modules/checkpoints/feature/ArtifactVisualizationContainer";
import { DownloadArtifactButtonContainer } from "@/modules/checkpoints/feature/DownloadArtifactButtonContainer";
import { VisualizationSkeleton } from "@/modules/checkpoints/ui/VisualizationSkeleton";
import { deriveScopesFromEntries } from "../business-logic/memory-operations";
import type { MemoryEntry, MemoryScopeInfo } from "../domain/memory";
import { MemorySidebar } from "../ui/MemorySidebar";
import { MemoryCenterPanel } from "../ui/MemoryCenterPanel";
import { MemoryHistorySidePanel } from "../ui/MemoryHistorySidePanel";
import { MemoryEmptyState } from "../ui/MemoryEmptyState";
import { MemoryToolbar } from "../ui/MemoryToolbar";

export function FlowMemoryContainer() {
	const { flowId } = useParams({
		from: "/_private/_navbar/flows/$flowId/$tab",
	});

	const { flowData } = useFlow(flowId);
	const flowName = flowData.name;

	const [activeScope, setActiveScope] = useState<MemoryScopeInfo>({
		scope: flowName,
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

	const memoryScopesData = useMemo(
		() =>
			deriveScopesFromEntries(
				namespaceEntries,
				flowEntries,
				executionEntries,
				flowName
			),
		[namespaceEntries, flowEntries, executionEntries, flowName]
	);

	const memoryEntriesData = useMemo(
		() =>
			[...namespaceEntries, ...flowEntries, ...executionEntries].filter(
				(e) =>
					e.scope === activeScope.scope && e.scopeType === activeScope.scopeType
			),
		[namespaceEntries, flowEntries, executionEntries, activeScope]
	);

	// Derive effective selected key: use user's choice if valid, else first entry
	const selectedKey = useMemo(() => {
		if (memoryEntriesData.length === 0) return undefined;
		if (
			userSelectedKey !== undefined &&
			memoryEntriesData.some((e) => e.key === userSelectedKey)
		) {
			return userSelectedKey;
		}
		return memoryEntriesData[0].key;
	}, [memoryEntriesData, userSelectedKey]);

	const {
		memoryHistoryData,
		isPending: isHistoryPending,
		refetch: refetchHistory,
	} = useMemoryHistory(activeScope.scope, activeScope.scopeType, selectedKey);

	const handleScopeChange = useCallback((scope: MemoryScopeInfo) => {
		setActiveScope(scope);
		setUserSelectedKey(undefined);
		setSelectedVersion(undefined);
	}, []);

	const handleSelectKey = useCallback((key: string) => {
		setUserSelectedKey(key);
		setSelectedVersion(undefined);
	}, []);

	const handleSelectVersion = useCallback((version: string) => {
		setSelectedVersion(version);
	}, []);

	// Manual refresh
	const { refresh, isPending: isRefreshing } = useManualRefresh(
		useCallback(async () => {
			await Promise.all([
				refetchEntries(),
				...(selectedKey ? [refetchHistory()] : []),
			]);
		}, [refetchEntries, refetchHistory, selectedKey])
	);

	// Derive the entry to show in the detail panel
	const selectedListEntry = memoryEntriesData.find(
		(e) => e.key === selectedKey
	);
	const selectedHistoryEntry = selectedVersion
		? memoryHistoryData?.find((e) => e.version === selectedVersion)
		: memoryHistoryData?.[0];
	const detailEntry: MemoryEntry | undefined =
		selectedHistoryEntry ?? selectedListEntry;

	const isFlowScope =
		activeScope.scope === flowName && activeScope.scopeType === "flow";

	const preview = detailEntry?.isDeleted ? (
		<MemoryEmptyState variant="no-preview" />
	) : detailEntry ? (
		<ErrorBoundary
			key={detailEntry.artifactId}
			fallback={<MemoryEmptyState variant="no-preview" />}
		>
			<Suspense fallback={<VisualizationSkeleton />}>
				<ArtifactVisualizationContainer
					artifactVersionId={detailEntry.artifactId}
				/>
			</Suspense>
		</ErrorBoundary>
	) : null;

	const previewActions = detailEntry ? (
		<DownloadArtifactButtonContainer
			artifactVersionId={detailEntry.artifactId}
		/>
	) : null;

	return (
		<ThreePanelLayout
			left={
				<MemorySidebar
					scopes={memoryScopesData}
					activeScope={activeScope}
					flowName={flowName}
					onScopeChange={handleScopeChange}
					entries={memoryEntriesData}
					selectedKey={selectedKey}
					onSelectKey={handleSelectKey}
					isEntriesPending={isEntriesPending}
				/>
			}
			center={
				<MemoryCenterPanel
					isPending={isEntriesPending}
					isError={isEntriesError}
					error={entriesError}
					isEmpty={memoryEntriesData.length === 0}
					isFlowScope={isFlowScope}
					scopeName={activeScope.scope}
					detailEntry={detailEntry}
					preview={preview}
					previewActions={previewActions}
				/>
			}
			right={
				<MemoryHistorySidePanel
					selectedKey={selectedKey}
					isPending={isHistoryPending}
					history={memoryHistoryData}
					selectedVersion={selectedVersion}
					onSelectVersion={handleSelectVersion}
				/>
			}
			centerHeader={
				<MemoryToolbar
					selectedKey={selectedKey}
					selectedEntry={detailEntry}
					selectedVersion={selectedVersion}
					history={memoryHistoryData}
					onSelectVersion={handleSelectVersion}
					isRefreshing={isRefreshing}
					onRefresh={refresh}
				/>
			}
		/>
	);
}
