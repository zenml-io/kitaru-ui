import { ChevronDown, ChevronUp, Copy, Download } from "lucide-react";
import type { ReactNode } from "react";
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

type LogsToolbarProps = {
	levelFilter: LoggingLevel;
	onLevelFilterChange: (level: LoggingLevel) => void;
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
	canExport: boolean;
	leading?: ReactNode;
	disabled?: boolean;
};

const LEVEL_OPTIONS = new Map<LoggingLevel, string>([
	[0, "All levels"],
	[10, "Debug"],
	[20, "Info"],
	[30, "Warning"],
	[40, "Error"],
	[50, "Critical"],
]);

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
	canExport,
	leading,
	disabled = false,
}: LogsToolbarProps) {
	const showSourceSwitcher = sources && sources.length > 1;
	const hasSearch = search.length > 0;

	return (
		<div className="border-border flex shrink-0 items-center gap-2 border-b p-2">
			{leading}
			<Select<LoggingLevel>
				value={levelFilter}
				disabled={disabled}
				onValueChange={(v) => {
					if (v !== null) onLevelFilterChange(v);
				}}
			>
				<SelectTrigger className="h-8 w-24 text-xs">
					<SelectValue>
						{(value: LoggingLevel) => LEVEL_OPTIONS.get(value)}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{[...LEVEL_OPTIONS].map(([value, label]) => (
						<SelectItem key={value} value={value}>
							{label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Input
				value={search}
				onChange={(e) => onSearchChange(e.target.value)}
				placeholder="Search logs..."
				className="h-8 min-w-24 flex-1 text-xs"
				disabled={disabled}
			/>
			{hasSearch && (
				<div className="text-2xs text-muted-foreground flex shrink-0 items-center gap-1 whitespace-nowrap tabular-nums">
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
						disabled={disabled || matchCount === 0}
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
						disabled={disabled || matchCount === 0}
						className="size-6"
						onClick={onNextMatch}
					>
						<ChevronDown className="size-3" />
					</Button>
				</div>
			)}
			{showSourceSwitcher && onSourceChange && (
				<Select
					value={selectedSource}
					disabled={disabled}
					onValueChange={(v) => {
						if (v !== null) onSourceChange(v);
					}}
				>
					<SelectTrigger className="h-8 min-w-42 text-xs">
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
				disabled={disabled || !canExport}
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
				disabled={disabled || !canExport}
				onClick={onDownload}
			>
				<Download className="size-3" />
			</Button>
		</div>
	);
}
