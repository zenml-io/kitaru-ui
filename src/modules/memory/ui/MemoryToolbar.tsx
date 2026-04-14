import { RefreshButton } from "@/shared/ui/RefreshButton";
import { TruncatedText } from "@/shared/ui/truncated-text";
import type { MemoryEntry } from "../domain/memory";
import { VersionSelector } from "./VersionSelector";

type MemoryToolbarProps = {
	selectedKey?: string;
	selectedEntry?: MemoryEntry;
	selectedVersion?: string;
	history?: MemoryEntry[];
	onSelectVersion: (version: string) => void;
	isRefreshing: boolean;
	onRefresh: () => void;
};

export function MemoryToolbar({
	selectedKey,
	selectedEntry,
	selectedVersion,
	history,
	onSelectVersion,
	isRefreshing,
	onRefresh,
}: MemoryToolbarProps) {
	const prefix = selectedKey?.includes("/")
		? selectedKey.slice(0, selectedKey.lastIndexOf("/") + 1)
		: null;
	const name = selectedKey?.includes("/")
		? selectedKey.slice(selectedKey.lastIndexOf("/") + 1)
		: selectedKey;

	return (
		<div className="flex flex-1 items-center gap-2">
			{selectedKey && (
				<TruncatedText className="font-mono text-sm font-semibold">
					{prefix && (
						<span className="text-muted-foreground font-normal">{prefix}</span>
					)}
					{name}
				</TruncatedText>
			)}

			{selectedEntry && history && history.length > 0 && (
				<VersionSelector
					history={history}
					selectedVersion={selectedVersion}
					currentVersion={selectedEntry.version}
					onSelectVersion={onSelectVersion}
				/>
			)}

			<span className="flex-1" />

			<RefreshButton
				variant="ghost"
				size="sm"
				isLoading={isRefreshing}
				onClick={onRefresh}
			/>
		</div>
	);
}
