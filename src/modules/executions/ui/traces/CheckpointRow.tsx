import { StatusDot } from "@/shared/ui/StatusDot";
import { CheckpointTypeBadge } from "./CheckpointTypeBadge";
import { ChevronRight } from "@untitledui/icons";
import { cn } from "@/shared/utils/styles";
import { CheckpointRowArtifacts } from "./CheckpointRowArtifacts";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { useLiveDurationMs } from "@/shared/business-logic/use-live-duration-ms";
import { formatDurationShort } from "@/shared/utils/time";

type CheckpointRowProps = {
	checkpointEntry: CheckpointEntry;
	isExpanded: boolean;
	onSelect: (id: string) => void;
	onToggle: (id: string) => void;
};

export function CheckpointRow({
	checkpointEntry,
	isExpanded,
	onSelect,
	onToggle,
}: CheckpointRowProps) {
	const durationMs = useLiveDurationMs({
		status: checkpointEntry.status,
		startTime: checkpointEntry.startTime,
		durationMs: checkpointEntry.durationMs,
	});

	return (
		<div
			className={cn(
				"bg-card relative overflow-hidden rounded-lg border transition-colors",
				isExpanded
					? "border-border bg-card"
					: "border-border hover:bg-accent/30"
			)}
		>
			<button
				type="button"
				className={cn(
					"flex h-10 w-full cursor-pointer items-center gap-2 px-4 text-left",
					isExpanded && "border-border border-b"
				)}
				onClick={() => {
					onSelect(checkpointEntry.id);
					onToggle(checkpointEntry.id);
				}}
			>
				<ChevronRight
					className={cn(
						"text-muted-foreground size-3.5 shrink-0 transition-transform",
						isExpanded && "rotate-90"
					)}
				/>
				{checkpointEntry.type && (
					<CheckpointTypeBadge type={checkpointEntry.type} />
				)}
				<span className="text-foreground truncate font-mono text-xs font-semibold">
					{checkpointEntry.name}
				</span>
				<span className="flex-1" />
				{durationMs !== undefined && durationMs > 0 && (
					<span className="text-2xs text-muted-foreground font-mono tabular-nums">
						{formatDurationShort(durationMs)}
					</span>
				)}
				<StatusDot status={checkpointEntry.status} />
			</button>

			{isExpanded && (
				<CheckpointRowArtifacts checkpointId={checkpointEntry.id} />
			)}
		</div>
	);
}
