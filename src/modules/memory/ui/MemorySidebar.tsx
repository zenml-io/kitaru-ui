import type { MemoryEntry, MemoryScopeInfo } from "../domain/memory";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/utils/styles";
import { formatRelativeTime } from "@/shared/utils/time";
import { MemoryScopeSelector } from "./MemoryScopeSelector";

type MemorySidebarProps = {
	scopes: MemoryScopeInfo[];
	activeScope: MemoryScopeInfo;
	flowName: string;
	onScopeChange: (scope: MemoryScopeInfo) => void;
	entries: MemoryEntry[];
	selectedKey?: string;
	onSelectKey: (key: string) => void;
	isEntriesPending: boolean;
};

export function MemorySidebar({
	scopes,
	activeScope,
	flowName,
	onScopeChange,
	entries,
	selectedKey,
	onSelectKey,
	isEntriesPending,
}: MemorySidebarProps) {
	return (
		<div className="flex h-full flex-col">
			{/* Scope selector */}
			<div className="border-border shrink-0 border-b px-3 py-2.5">
				<MemoryScopeSelector
					scopes={scopes}
					activeScope={activeScope}
					flowName={flowName}
					onScopeChange={onScopeChange}
				/>
			</div>

			{/* Keys header */}
			<div className="border-border flex shrink-0 items-center justify-between border-b px-3 py-2.5">
				<span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
					Keys
				</span>
				<span className="text-muted-foreground text-xs tabular-nums">
					{entries.length}
				</span>
			</div>

			{/* Key list */}
			{isEntriesPending ? (
				<div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
					Loading...
				</div>
			) : entries.length === 0 ? (
				<div className="text-muted-foreground flex flex-1 items-center justify-center px-3 text-center text-xs">
					No keys in this scope
				</div>
			) : (
				<div className="min-h-0 flex-1 overflow-y-auto">
					{entries.map((entry) => (
						<button
							key={entry.artifactId}
							type="button"
							onClick={() => onSelectKey(entry.key)}
							className={cn(
								"border-border/50 flex w-full cursor-pointer flex-col gap-0.5 border-b px-3 py-2.5 text-left transition-colors",
								entry.key === selectedKey ? "bg-accent" : "hover:bg-accent/50"
							)}
						>
							<div className="flex w-full items-center gap-1.5">
								<span
									className={cn(
										"min-w-0 flex-1 truncate font-mono text-xs font-medium",
										entry.isDeleted && "line-through opacity-60"
									)}
								>
									{entry.key}
								</span>
								<Badge
									variant="secondary"
									className="text-2xs shrink-0 font-mono"
								>
									{entry.valueType}
								</Badge>
								{entry.isDeleted && (
									<Badge variant="destructive" className="text-2xs shrink-0">
										del
									</Badge>
								)}
							</div>
							<div className="text-muted-foreground text-2xs flex items-center gap-1.5">
								<span className="tabular-nums">v{entry.version}</span>
								<span>&middot;</span>
								<span>{formatRelativeTime(entry.createdAt)}</span>
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
