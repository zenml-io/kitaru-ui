import { useVirtualizer } from "@tanstack/react-virtual";
import { FileText } from "lucide-react";
import { useEffect, useRef } from "react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zenml/hashi/primitives/empty";
import type { LogEntry, LogMessageRange } from "../domain/log-entry";
import { LogRow } from "./LogRow";

type ActiveMatch = { logIndex: number; range: LogMessageRange };

type LogsListProps = {
	logs: LogEntry[];
	density?: "compact" | "comfortable";
	matchesByLogIndex?: Map<number, LogMessageRange[]>;
	activeMatch?: ActiveMatch;
	onCopyRow?: (entry: LogEntry) => void;
};

export function LogsList({
	logs,
	density = "comfortable",
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
			<div className="border-border bg-muted/30 text-2xs text-muted-foreground flex shrink-0 items-center gap-3 border-b px-4 py-2.5 font-semibold tracking-wider uppercase">
				<span className="w-14 shrink-0">Level</span>
				<span className="w-[88px] shrink-0">Time</span>
				<span className="flex-1">Event</span>
			</div>
			<div ref={parentRef} className="min-h-0 flex-1 overflow-auto">
				<div
					style={{
						height: virtualizer.getTotalSize(),
						position: "relative",
						width: "100%",
					}}
				>
					{/* Canonical @tanstack/react-virtual dynamic-sizing pattern: a single
					    translated wrapper positions the first visible row, and the rest
					    stack naturally. This avoids re-translating every row when a
					    measurement changes. */}
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							transform: `translateY(${virtualizer.getVirtualItems()[0]?.start ?? 0}px)`,
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
		</div>
	);
}
