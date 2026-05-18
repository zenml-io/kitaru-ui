import { StatusDot } from "@/shared/ui/StatusDot";
import { CheckpointTypeBadge } from "./CheckpointTypeBadge";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";
import { LiveDurationMs } from "@/shared/ui/LiveDurationMs";
import { TruncatedText } from "@/shared/ui/truncated-text";
import { cn } from "@/shared/utils/styles";

type CheckpointRowProps = {
	checkpointEntry: CheckpointEntry;
	isSelected: boolean;
	onSelect: (id: string) => void;
};

export function CheckpointRow({
	checkpointEntry,
	isSelected,
	onSelect,
}: CheckpointRowProps) {
	return (
		<button
			type="button"
			aria-pressed={isSelected}
			onClick={() => onSelect(checkpointEntry.id)}
			className={cn(
				"border-border flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border px-4 text-left transition-colors",
				isSelected ? "bg-accent" : "bg-card hover:bg-accent/30"
			)}
		>
			{/* Aligns with the chevron in sibling WaitingBlockRow. */}
			<span className="size-3.5 shrink-0" />
			{checkpointEntry.type && (
				<CheckpointTypeBadge type={checkpointEntry.type} />
			)}
			<TruncatedText className="text-foreground font-mono text-xs font-semibold">
				{checkpointEntry.name}
			</TruncatedText>
			<span className="flex-1" />
			<LiveDurationMs
				status={checkpointEntry.status}
				startTime={checkpointEntry.startTime}
				durationMs={checkpointEntry.durationMs}
				className="text-2xs text-muted-foreground font-mono tabular-nums"
			/>
			<StatusDot status={checkpointEntry.status} />
		</button>
	);
}
