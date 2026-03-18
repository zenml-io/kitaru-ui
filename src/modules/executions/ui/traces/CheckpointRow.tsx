import { StatusDot } from "@/shared/ui/StatusDot";
import { CheckpointTypeBadge } from "./CheckpointTypeBadge";
import { ChevronRight } from "@untitledui/icons";
import { formatCost } from "@/shared/utils/currency";
import { cn } from "@/shared/utils/styles";
import { CheckpointRowArtifacts } from "./CheckpointRowArtifacts";
import type { Checkpoint } from "@/modules/checkpoints/domain/checkpoint";

type CheckpointRowProps = {
	checkpoint: Checkpoint;
	isExpanded: boolean;
	onSelect: (id: string) => void;
	onToggle: (id: string) => void;
};

export function CheckpointRow({
	checkpoint,
	isExpanded,
	onSelect,
	onToggle,
}: CheckpointRowProps) {
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
					onSelect(checkpoint.id);
					onToggle(checkpoint.id);
				}}
			>
				<ChevronRight
					className={cn(
						"text-muted-foreground size-3.5 shrink-0 transition-transform",
						isExpanded && "rotate-90"
					)}
				/>
				<CheckpointTypeBadge type={checkpoint.type} />
				<span className="text-foreground truncate font-mono text-xs font-semibold">
					{checkpoint.name}
				</span>
				{checkpoint.costUsd != null && checkpoint.costUsd > 0 && (
					<span className="text-2xs text-foreground/70 shrink-0 font-mono tabular-nums">
						{formatCost(checkpoint.costUsd)}
					</span>
				)}
				<span className="flex-1" />
				<StatusDot status={checkpoint.status} />
			</button>

			{isExpanded && <CheckpointRowArtifacts checkpointId={checkpoint.id} />}
		</div>
	);
}
