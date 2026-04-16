import { useVirtualizer } from "@tanstack/react-virtual";
import { FileText } from "lucide-react";
import { useEffect, useRef } from "react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/shared/ui/empty";
import { cn } from "@/shared/utils/styles";
import type { LogEntry, LogMessageRange } from "../domain/log-entry";
import { LogRow } from "./LogRow";

type ActiveMatch = { logIndex: number; range: LogMessageRange };

type LogsListProps = {
	logs: LogEntry[];
	density?: "compact" | "comfortable";
	showHeaders?: boolean;
	matchesByLogIndex?: Map<number, LogMessageRange[]>;
	activeMatch?: ActiveMatch;
	onCopyRow?: (entry: LogEntry) => void;
};

export function LogsList({
	logs,
	density = "comfortable",
	showHeaders = false,
	matchesByLogIndex,
	activeMatch,
	onCopyRow,
}: LogsListProps) {
	const parentRef = useRef<HTMLDivElement>(null);
	const rowHeight = density === "compact" ? 20 : 28;

	const virtualizer = useVirtualizer({
		count: logs.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => rowHeight,
		overscan: 20,
	});

	const activeIndex = activeMatch?.logIndex;
	const activeStart = activeMatch?.range.start;
	const activeEnd = activeMatch?.range.end;

	useEffect(() => {
		if (activeIndex == null) return;
		virtualizer.scrollToIndex(activeIndex, { align: "center" });
		// Re-run when the active match index OR the active range changes (range
		// deps catch moving between matches inside the same row). `virtualizer`
		// is omitted: its identity is stable across renders and not part of the
		// trigger condition.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeIndex, activeStart, activeEnd]);

	if (logs.length === 0) {
		return (
			<Empty className="border-0">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<FileText />
					</EmptyMedia>
					<EmptyTitle>No logs</EmptyTitle>
					<EmptyDescription>No log entries to display.</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			{showHeaders && (
				<div
					className={cn(
						"border-border text-2xs text-muted-foreground flex shrink-0 items-center gap-2 border-b px-2.5 py-2 font-semibold tracking-wider uppercase"
					)}
				>
					<span style={{ width: density === "compact" ? 48 : 60 }}>Level</span>
					<span style={{ width: density === "compact" ? 88 : 100 }}>Time</span>
					<span className="flex-1">Event</span>
				</div>
			)}
			<div ref={parentRef} className="min-h-0 flex-1 overflow-auto">
				<div
					style={{
						height: virtualizer.getTotalSize(),
						position: "relative",
						width: "100%",
					}}
				>
					{virtualizer.getVirtualItems().map((virtualRow) => {
						const entry = logs[virtualRow.index];
						const ranges = matchesByLogIndex?.get(virtualRow.index);
						const activeStart =
							activeMatch?.logIndex === virtualRow.index
								? activeMatch.range.start
								: undefined;
						return (
							<div
								key={entry.id ?? virtualRow.index}
								data-index={virtualRow.index}
								ref={virtualizer.measureElement}
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<LogRow
									entry={entry}
									density={density}
									highlightRanges={ranges}
									activeHighlightStart={activeStart}
									onCopy={onCopyRow}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
