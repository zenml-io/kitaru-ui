import type { MemoryEntry } from "../domain/memory";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/utils/styles";
import { formatRelativeTime } from "@/shared/utils/time";
import { ExecutionLinkAction } from "./ExecutionLinkAction";

type MemoryHistoryPanelProps = {
	history: MemoryEntry[];
	selectedVersion?: string;
	flowId: string;
	onSelectVersion: (version: string) => void;
};

export function MemoryHistoryPanel({
	history,
	selectedVersion,
	flowId,
	onSelectVersion,
}: MemoryHistoryPanelProps) {
	const activeVersion = selectedVersion ?? history[0]?.version;

	return (
		<div className="flex flex-col px-4 py-3">
			<h3 className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
				Version History
			</h3>
			<div className="relative flex flex-col">
				{history.map((entry, index) => {
					const isActive = entry.version === activeVersion;
					const isLatest = index === 0;
					const isLast = index === history.length - 1;

					return (
						<div key={entry.artifactId} className="relative flex gap-3 pb-4">
							{/* Timeline line */}
							{!isLast && (
								<div className="bg-border absolute top-5 bottom-0 left-[7px] w-px" />
							)}

							{/* Timeline dot */}
							<div
								className={cn(
									"relative z-10 mt-1 size-[15px] shrink-0 rounded-full border-2",
									isActive
										? "border-primary bg-primary"
										: "border-border bg-background"
								)}
							/>

							{/* Content */}
							<div
								role="button"
								tabIndex={0}
								onClick={() => onSelectVersion(entry.version)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										onSelectVersion(entry.version);
									}
								}}
								className={cn(
									"flex min-w-0 flex-1 cursor-pointer flex-col gap-1 rounded-md px-2 py-1 transition-colors",
									isActive ? "bg-accent" : "hover:bg-muted/50"
								)}
							>
								<div className="flex items-center gap-1.5">
									<span className="font-mono text-xs font-medium tabular-nums">
										v{entry.version}
									</span>
									{isLatest && (
										<Badge variant="secondary" className="text-2xs shrink-0">
											latest
										</Badge>
									)}
									{entry.isDeleted && (
										<Badge variant="destructive" className="text-2xs shrink-0">
											deleted
										</Badge>
									)}
								</div>
								<div className="flex items-center gap-2">
									<span className="text-muted-foreground text-xs">
										{formatRelativeTime(entry.createdAt)}
									</span>
									<span className="flex-1" />
									{entry.executionId && (
										<ExecutionLinkAction
											flowId={flowId}
											executionId={entry.executionId}
											iconSize="size-3"
										/>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
