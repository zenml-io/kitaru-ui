import { CheckpointTypeBadge } from "./CheckpointTypeBadge";
import { formatDurationShort } from "@/shared/utils/time";
import type { WaitingBlock } from "../../domain/waiting-block";

type WaitingBlockRowProps = {
	waitingBlock: WaitingBlock;
};

export function WaitingBlockRow({ waitingBlock }: WaitingBlockRowProps) {
	return (
		<div className="border-warning/30 border-l-warning bg-card relative overflow-hidden rounded-lg border border-l-[3px]">
			<div className="flex flex-col gap-1.5 px-4 py-2.5">
				<div className="flex items-center gap-2">
					<CheckpointTypeBadge type="wait" />
					<span className="text-foreground font-mono text-xs font-semibold">
						User Input
					</span>
					<span className="flex-1" />
					{waitingBlock.waitDurationMs != null && (
						<span className="text-2xs text-muted-foreground font-mono tabular-nums">
							{formatDurationShort(waitingBlock.waitDurationMs)}
						</span>
					)}
				</div>
				{waitingBlock.question && (
					<p className="text-muted-foreground text-xs">
						<span className="font-semibold">Q:</span> {waitingBlock.question}
					</p>
				)}
				<p className="text-foreground truncate text-xs">
					<span className="text-muted-foreground font-semibold">A:</span>{" "}
					{waitingBlock.answer}
				</p>
			</div>
		</div>
	);
}
