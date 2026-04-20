import { Copy } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/styles";
import { formatTimestamp } from "@/shared/utils/time";
import type { LogEntry, LogMessageRange } from "../domain/log-entry";
import { LOG_LEVEL_STYLES } from "./log-styles";

type LogRowProps = {
	entry: LogEntry;
	density?: "compact" | "comfortable";
	highlightRanges?: LogMessageRange[];
	activeHighlightStart?: number;
	onCopy?: (entry: LogEntry) => void;
};

export function LogRow({
	entry,
	density = "comfortable",
	highlightRanges,
	activeHighlightStart,
	onCopy,
}: LogRowProps) {
	const style = entry.level != null ? LOG_LEVEL_STYLES[entry.level] : null;
	const time = formatTimestamp(entry.timestamp);
	const isCompact = density === "compact";

	return (
		<div
			className={cn(
				"group hover:bg-accent/40 flex w-full items-center gap-3 border-b border-transparent px-4 font-mono text-xs",
				isCompact ? "py-1" : "py-1.5"
			)}
		>
			<span
				className={cn(
					"inline-flex w-14 shrink-0 items-center justify-center rounded px-1.5 py-0.5 text-[0.625rem] font-medium tracking-wide uppercase tabular-nums",
					style?.pill ?? "bg-muted text-muted-foreground"
				)}
			>
				{style?.label ?? ""}
			</span>
			<span className="text-muted-foreground w-[88px] shrink-0 tabular-nums">
				{time}
			</span>
			<span className="text-foreground min-w-0 flex-1 break-words whitespace-pre-wrap">
				{renderMessage(entry.message, highlightRanges, activeHighlightStart)}
			</span>
			{onCopy && (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label="Copy log entry"
					className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
					onClick={() => onCopy(entry)}
				>
					<Copy className="size-3" />
				</Button>
			)}
		</div>
	);
}

function renderMessage(
	message: string,
	ranges: LogMessageRange[] | undefined,
	activeStart: number | undefined
) {
	if (!ranges || ranges.length === 0) return message;
	const parts: React.ReactNode[] = [];
	let cursor = 0;
	const sorted = [...ranges].sort((a, b) => a.start - b.start);
	for (let i = 0; i < sorted.length; i++) {
		const r = sorted[i];
		// Skip ranges that overlap a prior range — avoids negative slices.
		if (r.start < cursor) continue;
		if (r.start > cursor) {
			parts.push(message.slice(cursor, r.start));
		}
		const isActive = activeStart === r.start;
		parts.push(
			<mark
				key={`${r.start}-${r.end}`}
				className={cn(
					"rounded-sm",
					isActive
						? "bg-warning/50 text-foreground"
						: "bg-warning/25 text-foreground"
				)}
			>
				{message.slice(r.start, r.end)}
			</mark>
		);
		cursor = r.end;
	}
	if (cursor < message.length) parts.push(message.slice(cursor));
	return parts;
}
