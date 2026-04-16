import { ChevronDown, ChevronUp, Copy, Download } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import type { LoggingLevel } from "../domain/log-entry";

export type LevelFilter = LoggingLevel | "all";

type LogsToolbarProps = {
	levelFilter: LevelFilter;
	onLevelFilterChange: (level: LevelFilter) => void;
	search: string;
	onSearchChange: (value: string) => void;
	matchCount: number;
	activeMatchIndex: number;
	onNextMatch: () => void;
	onPrevMatch: () => void;
	sources?: string[];
	selectedSource?: string;
	onSourceChange?: (source: string) => void;
	onCopyAll: () => void;
	onDownload: () => void;
};

const LEVEL_OPTIONS: { value: LevelFilter; label: string }[] = [
	{ value: "all", label: "All levels" },
	{ value: 10, label: "Debug" },
	{ value: 20, label: "Info" },
	{ value: 30, label: "Warning" },
	{ value: 40, label: "Error" },
	{ value: 50, label: "Critical" },
];

export function LogsToolbar({
	levelFilter,
	onLevelFilterChange,
	search,
	onSearchChange,
	matchCount,
	activeMatchIndex,
	onNextMatch,
	onPrevMatch,
	sources,
	selectedSource,
	onSourceChange,
	onCopyAll,
	onDownload,
}: LogsToolbarProps) {
	const showSourceSwitcher = (sources?.length ?? 0) > 1;
	const hasSearch = search.length > 0;

	return (
		<div className="border-border flex shrink-0 items-center gap-2 border-b p-2">
			<Select
				value={String(levelFilter)}
				onValueChange={(v) =>
					onLevelFilterChange(v === "all" ? "all" : (Number(v) as LoggingLevel))
				}
			>
				<SelectTrigger className="h-8 w-[132px] text-xs">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{LEVEL_OPTIONS.map((opt) => (
						<SelectItem key={String(opt.value)} value={String(opt.value)}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Input
				value={search}
				onChange={(e) => onSearchChange(e.target.value)}
				placeholder="Search logs..."
				className="h-8 w-[160px] text-xs"
			/>
			{hasSearch && (
				<div className="text-2xs text-muted-foreground flex items-center gap-1 tabular-nums">
					<span>
						{matchCount === 0
							? "0 of 0"
							: `${activeMatchIndex + 1} of ${matchCount}`}
					</span>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Previous match"
						disabled={matchCount === 0}
						className="size-6"
						onClick={onPrevMatch}
					>
						<ChevronUp className="size-3" />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Next match"
						disabled={matchCount === 0}
						className="size-6"
						onClick={onNextMatch}
					>
						<ChevronDown className="size-3" />
					</Button>
				</div>
			)}
			<div className="flex-1" />
			{showSourceSwitcher && onSourceChange && sources && (
				<Select
					value={selectedSource}
					onValueChange={(v) => {
						if (v !== null) onSourceChange(v);
					}}
				>
					<SelectTrigger className="h-8 w-[140px] text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{sources.map((s) => (
							<SelectItem key={s} value={s}>
								{s}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
			<Button
				type="button"
				variant="outline"
				size="icon"
				aria-label="Copy all logs"
				className="size-8"
				onClick={onCopyAll}
			>
				<Copy className="size-3" />
			</Button>
			<Button
				type="button"
				variant="outline"
				size="icon"
				aria-label="Download logs"
				className="size-8"
				onClick={onDownload}
			>
				<Download className="size-3" />
			</Button>
		</div>
	);
}
