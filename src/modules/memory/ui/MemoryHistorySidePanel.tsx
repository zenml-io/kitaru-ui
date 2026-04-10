import type { MemoryEntry } from "../domain/memory";
import { cn } from "@/shared/utils/styles";
import { VersionListItem } from "./VersionListItem";

type MemoryHistorySidePanelProps = {
	selectedKey: string | undefined;
	isPending: boolean;
	history: MemoryEntry[] | undefined;
	selectedVersion: string | undefined;
	onSelectVersion: (version: string) => void;
};

export function MemoryHistorySidePanel({
	selectedKey,
	isPending,
	history,
	selectedVersion,
	onSelectVersion,
}: MemoryHistorySidePanelProps) {
	if (!selectedKey) {
		return (
			<div className="text-muted-foreground flex h-full items-center justify-center px-4 text-center text-xs">
				Select a memory entry to view its history
			</div>
		);
	}

	if (isPending) {
		return (
			<div className="text-muted-foreground flex h-full items-center justify-center text-sm">
				Loading history...
			</div>
		);
	}

	if (!history || history.length === 0) {
		return (
			<div className="text-muted-foreground flex h-full items-center justify-center px-4 text-center text-xs">
				No history available
			</div>
		);
	}

	const activeVersion = selectedVersion ?? history[0]?.version;

	return (
		<div className="flex h-full flex-col">
			<div className="border-border shrink-0 border-b px-4 py-2.5">
				<span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
					Version History
				</span>
			</div>
			<div className="min-h-0 flex-1 overflow-y-auto">
				{history.map((entry, index) => {
					const isLatest = index === 0;
					const isActive = entry.version === activeVersion;

					return (
						<button
							key={entry.artifactId}
							type="button"
							onClick={() => onSelectVersion(entry.version)}
							className={cn(
								"border-border/50 hover:bg-accent/50 flex w-full cursor-pointer items-center gap-2.5 border-b px-4 py-3 text-left transition-colors",
								isActive && "bg-accent/30"
							)}
						>
							<VersionListItem entry={entry} isLatest={isLatest} />
						</button>
					);
				})}
			</div>
		</div>
	);
}
