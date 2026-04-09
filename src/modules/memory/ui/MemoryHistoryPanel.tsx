import type { MemoryEntry } from "../domain/memory";
import { cn } from "@/shared/utils/styles";
import { VersionListItem } from "./VersionListItem";

type MemoryHistoryPanelProps = {
	history: MemoryEntry[];
	selectedVersion?: string;
	onSelectVersion: (version: string) => void;
};

export function MemoryHistoryPanel({
	history,
	selectedVersion,
	onSelectVersion,
}: MemoryHistoryPanelProps) {
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
