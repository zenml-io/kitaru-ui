import { cn } from "@/shared/utils/styles";
import { formatRelativeTime } from "@/shared/utils/time";
import type { MemoryEntry } from "../domain/memory";

type VersionListItemProps = {
	entry: MemoryEntry;
	isLatest: boolean;
};

export function VersionListItem({ entry, isLatest }: VersionListItemProps) {
	return (
		<>
			<div
				className={cn(
					"size-2 shrink-0 rounded-full",
					isLatest && !entry.isDeleted
						? "bg-primary"
						: "border-muted-foreground/30 border-2 bg-transparent"
				)}
			/>
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<span className="text-foreground text-xs font-semibold tabular-nums">
						v{entry.version}
					</span>
					{isLatest && !entry.isDeleted && (
						<span className="text-primary text-2xs font-medium">latest</span>
					)}
					{entry.isDeleted && (
						<span className="text-destructive text-2xs font-medium">
							deleted
						</span>
					)}
				</div>
				<div className="text-muted-foreground text-2xs">
					{formatRelativeTime(entry.createdAt)}
				</div>
			</div>
		</>
	);
}
