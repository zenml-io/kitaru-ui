import type { MemoryEntry } from "../domain/memory";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/utils/styles";
import { formatRelativeTime } from "@/shared/utils/time";
import { ExecutionLinkAction } from "./ExecutionLinkAction";

type MemoryEntriesListProps = {
	entries: MemoryEntry[];
	selectedKey?: string;
	flowId: string;
	onSelect: (key: string) => void;
};

export function MemoryEntriesList({
	entries,
	selectedKey,
	flowId,
	onSelect,
}: MemoryEntriesListProps) {
	return (
		<div className="flex flex-col">
			{entries.map((entry) => (
				<MemoryEntryRow
					key={entry.artifactId}
					entry={entry}
					isSelected={entry.key === selectedKey}
					flowId={flowId}
					onSelect={onSelect}
				/>
			))}
		</div>
	);
}

type MemoryEntryRowProps = {
	entry: MemoryEntry;
	isSelected: boolean;
	flowId: string;
	onSelect: (key: string) => void;
};

function MemoryEntryRow({
	entry,
	isSelected,
	flowId,
	onSelect,
}: MemoryEntryRowProps) {
	return (
		<div
			role="button"
			tabIndex={0}
			onClick={() => onSelect(entry.key)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect(entry.key);
				}
			}}
			className={cn(
				"border-border flex cursor-pointer flex-col gap-1 border-b px-3 py-2.5 transition-colors",
				isSelected ? "bg-accent" : "hover:bg-muted/50"
			)}
		>
			<div className="flex items-center gap-2">
				<span className="min-w-0 flex-1 truncate text-sm font-medium">
					{entry.key}
				</span>
				<Badge variant="secondary" className="text-2xs shrink-0 font-mono">
					{entry.valueType}
				</Badge>
			</div>
			<div className="flex items-center gap-2">
				<span className="text-muted-foreground font-mono text-xs tabular-nums">
					v{entry.version}
				</span>
				<span className="text-muted-foreground text-xs">
					{formatRelativeTime(entry.createdAt)}
				</span>
				<span className="flex-1" />
				<ExecutionLinkAction flowId={flowId} executionId={entry.executionId} />
			</div>
		</div>
	);
}
