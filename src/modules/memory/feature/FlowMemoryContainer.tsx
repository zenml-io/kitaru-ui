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
import { deriveScopesFromEntries } from "../domain/memory";
import type { MemoryEntry } from "../domain/memory";
import { MemorySidebar } from "../ui/MemorySidebar";
import { MemoryDetailPanel } from "../ui/MemoryDetailPanel";
import { MemoryHistoryPanel } from "../ui/MemoryHistoryPanel";
import { MemoryEmptyState } from "../ui/MemoryEmptyState";
import { MemoryToolbar } from "../ui/MemoryToolbar";

export function FlowMemoryContainer() {
	const { flowId } = useParams({
		from: "/_private/_navbar/flows/$flowId/$tab",
	});

	const { flowData } = useFlow(flowId);
	const flowName = flowData.name;

	const [activeScope, setActiveScope] = useState(flowName);
	const [userSelectedKey, setUserSelectedKey] = useState<string | undefined>();
	const [selectedVersion, setSelectedVersion] = useState<string | undefined>();

	const {
		namespaceEntries,
		flowEntries,
		executionEntries,
		isPending: isEntriesPending,
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
				(e) => e.scope === activeScope
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
	} = useMemoryHistory(activeScope, selectedKey);

	// memoryScopesData already includes flow scope via deriveScopesFromEntries

	const handleScopeChange = useCallback((scope: string) => {
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

	// --- Panel content ---

	const leftPanel = (
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
	);

	const centerPanel = (() => {
		if (isEntriesPending) {
			return (
				<div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
					Loading memory entries...
				</div>
			);
		}

		if (memoryEntriesData.length === 0) {
			return (
				<MemoryEmptyState
					variant={activeScope === flowName ? "no-memory" : "no-scope-memory"}
					scopeName={activeScope}
				/>
			);
		}

		if (!detailEntry) {
			return null;
		}

		const previewNode = detailEntry.isDeleted ? (
			<MemoryEmptyState variant="no-preview" />
		) : (
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
		);

		const previewActions = (
			<DownloadArtifactButtonContainer
				artifactVersionId={detailEntry.artifactId}
			/>
		);

		return (
			<MemoryDetailPanel
				entry={detailEntry}
				preview={previewNode}
				previewActions={previewActions}
			/>
		);
	})();

	const rightPanel = (() => {
		if (!selectedKey) {
			return (
				<div className="text-muted-foreground flex h-full items-center justify-center px-4 text-center text-xs">
					Select a memory entry to view its history
				</div>
			);
		}

		if (isHistoryPending) {
			return (
				<div className="text-muted-foreground flex h-full items-center justify-center text-sm">
					Loading history...
				</div>
			);
		}

		if (!memoryHistoryData || memoryHistoryData.length === 0) {
			return (
				<div className="text-muted-foreground flex h-full items-center justify-center px-4 text-center text-xs">
					No history available
				</div>
			);
		}

		return (
			<MemoryHistoryPanel
				history={memoryHistoryData}
				selectedVersion={selectedVersion}
				onSelectVersion={handleSelectVersion}
			/>
		);
	})();

	const centerHeader = (
		<MemoryToolbar
			selectedKey={selectedKey}
			selectedEntry={detailEntry}
			selectedVersion={selectedVersion}
			history={memoryHistoryData}
			onSelectVersion={handleSelectVersion}
			isRefreshing={isRefreshing}
			onRefresh={refresh}
		/>
	);

	return (
		<ThreePanelLayout
			left={leftPanel}
			center={centerPanel}
			right={rightPanel}
			centerHeader={centerHeader}
		/>
	);
}
