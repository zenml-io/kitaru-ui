import { Suspense, useCallback, useMemo, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";
import { useFlow } from "@/modules/flows/business-logic/use-flow";
import { useMemoryScopes } from "@/modules/memory/business-logic/use-memory-scopes";
import { useMemories } from "@/modules/memory/business-logic/use-memories";
import { useMemoryHistory } from "@/modules/memory/business-logic/use-memory-history";
import { useManualRefresh } from "@/shared/business-logic/use-manual-refresh";
import { RefreshButton } from "@/shared/ui/RefreshButton";
import { ThreePanelLayout } from "@/shared/ui/ThreePanelLayout";
import { ArtifactVisualizationContainer } from "@/modules/checkpoints/feature/ArtifactVisualizationContainer";
import { DownloadArtifactButtonContainer } from "@/modules/checkpoints/feature/DownloadArtifactButtonContainer";
import { VisualizationSkeleton } from "@/modules/checkpoints/ui/VisualizationSkeleton";
import { SCOPE_TYPE_SORT_ORDER } from "../domain/memory";
import type { MemoryEntry, MemoryScopeInfo } from "../domain/memory";
import { MemoryScopeSelector } from "../ui/MemoryScopeSelector";
import { MemoryEntriesList } from "../ui/MemoryEntriesList";
import { MemoryDetailPanel } from "../ui/MemoryDetailPanel";
import { MemoryHistoryPanel } from "../ui/MemoryHistoryPanel";
import { MemoryEmptyState } from "../ui/MemoryEmptyState";

export function FlowMemoryContainer() {
	const { flowId } = useParams({
		from: "/_private/_navbar/flows/$flowId/$tab",
	});

	const { flowData } = useFlow(flowId);
	const flowName = flowData.name;

	const [activeScope, setActiveScope] = useState(flowName);
	const [userSelectedKey, setUserSelectedKey] = useState<string | undefined>();
	const [selectedVersion, setSelectedVersion] = useState<string | undefined>();

	const { memoryScopesData, refetch: refetchScopes } = useMemoryScopes();
	const {
		memoryEntriesData,
		isPending: isEntriesPending,
		refetch: refetchEntries,
	} = useMemories(activeScope);

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

	// Synthetic scope merge: ensure active scope always appears in dropdown
	const mergedScopes = useMemo(() => {
		const hasActive = memoryScopesData.some((s) => s.scope === activeScope);
		const scopes: MemoryScopeInfo[] = hasActive
			? memoryScopesData
			: [
					...memoryScopesData,
					{
						scope: activeScope,
						scopeType: activeScope === flowName ? "flow" : "unknown",
						entryCount: 0,
					},
				];
		return scopes.slice().sort((a, b) => {
			const typeOrder =
				SCOPE_TYPE_SORT_ORDER[a.scopeType] - SCOPE_TYPE_SORT_ORDER[b.scopeType];
			if (typeOrder !== 0) return typeOrder;
			return a.scope.localeCompare(b.scope);
		});
	}, [memoryScopesData, activeScope, flowName]);

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
				refetchScopes(),
				refetchEntries(),
				...(selectedKey ? [refetchHistory()] : []),
			]);
		}, [refetchScopes, refetchEntries, refetchHistory, selectedKey])
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
		<div className="flex h-full flex-col">
			<div className="border-border shrink-0 border-b p-3">
				<MemoryScopeSelector
					scopes={mergedScopes}
					activeScope={activeScope}
					flowName={flowName}
					onScopeChange={handleScopeChange}
				/>
			</div>
			{isEntriesPending ? (
				<div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
					Loading...
				</div>
			) : memoryEntriesData.length === 0 ? (
				<div className="text-muted-foreground flex flex-1 items-center justify-center px-3 text-center text-xs">
					No keys in this scope
				</div>
			) : (
				<div className="min-h-0 flex-1 overflow-y-auto">
					<MemoryEntriesList
						entries={memoryEntriesData}
						selectedKey={selectedKey}
						flowId={flowId}
						onSelect={handleSelectKey}
					/>
				</div>
			)}
		</div>
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
				flowId={flowId}
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
				flowId={flowId}
				onSelectVersion={handleSelectVersion}
			/>
		);
	})();

	const centerHeader = (
		<RefreshButton
			variant="ghost"
			size="sm"
			isLoading={isRefreshing}
			onClick={refresh}
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
