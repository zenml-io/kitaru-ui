import { Copy } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/styles";
import type { LogEntry } from "../domain/log-entry";
import { LOG_LEVEL_STYLES } from "./log-styles";

export type HighlightRange = { start: number; end: number };

type LogRowProps = {
	entry: LogEntry;
	density?: "compact" | "comfortable";
	highlightRanges?: HighlightRange[];
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
				"group hover:bg-accent/40 flex items-start gap-2 border-b border-transparent px-2.5",
				isCompact ? "py-0.5" : "py-1.5"
			)}
		>
			<span
				className={cn(
					"inline-flex shrink-0 items-center justify-center rounded px-1.5 font-mono font-medium tabular-nums",
					style?.bg,
					style?.text,
					isCompact ? "py-px text-[0.625rem]" : "text-2xs py-0.5"
				)}
				style={{ width: isCompact ? 48 : 60 }}
			>
				{style?.label ?? ""}
			</span>
			<span
				className={cn(
					"text-muted-foreground shrink-0 font-mono tabular-nums",
					isCompact ? "text-[0.625rem]" : "text-2xs"
				)}
				style={{ width: isCompact ? 88 : 100 }}
			>
				{time}
			</span>
			<span
				className={cn(
					"text-foreground min-w-0 flex-1 font-mono",
					isCompact ? "text-[0.6875rem] break-all" : "text-xs"
				)}
			>
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

function formatTimestamp(ts: string | null | undefined): string {
	if (!ts) return "";
	const d = new Date(ts);
	if (Number.isNaN(d.getTime())) return ts;
	const hh = String(d.getHours()).padStart(2, "0");
	const mm = String(d.getMinutes()).padStart(2, "0");
	const ss = String(d.getSeconds()).padStart(2, "0");
	const ms = String(d.getMilliseconds()).padStart(3, "0");
	return `${hh}:${mm}:${ss}.${ms}`;
}

function renderMessage(
	message: string,
	ranges: HighlightRange[] | undefined,
	activeStart: number | undefined
) {
	if (!ranges || ranges.length === 0) return message;
	const parts: React.ReactNode[] = [];
	let cursor = 0;
	const sorted = [...ranges].sort((a, b) => a.start - b.start);
	for (let i = 0; i < sorted.length; i++) {
		const r = sorted[i];
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
