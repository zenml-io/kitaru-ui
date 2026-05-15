import { useEffect, useRef } from "react";
import { cn } from "@/shared/utils/styles";
import { HIGHLIGHT_MS } from "@/shared/business-logic/use-scroll-highlight";
import { CheckpointRow } from "./CheckpointRow";
import { WaitingBlockRow } from "./WaitingBlockRow";
import type { TimelineEntry } from "../../domain/waiting-block";

type CheckpointThreadProps = {
	timelineEntries: TimelineEntry[];
	selectedCheckpointId: string | undefined;
	onSelect: (id: string) => void;
	highlightedId?: string;
};

export function CheckpointThread({
	timelineEntries,
	selectedCheckpointId,
	onSelect,
	highlightedId,
}: CheckpointThreadProps) {
	return (
		<div
			className="flex-1 space-y-3 overflow-y-auto p-6"
			style={{ "--highlight-duration": `${HIGHLIGHT_MS}ms` }}
		>
			{timelineEntries.map((entry) => (
				<RowHighlightedWrapper
					key={entry.data.id}
					highlighted={highlightedId === entry.data.id}
				>
					{entry.kind === "waiting" ? (
						<WaitingBlockRow waitingBlock={entry.data} />
					) : (
						<CheckpointRow
							checkpointEntry={entry.data}
							isSelected={selectedCheckpointId === entry.data.id}
							onSelect={onSelect}
						/>
					)}
				</RowHighlightedWrapper>
			))}
		</div>
	);
}

type RowHighlightedWrapperProps = {
	highlighted?: boolean;
	children: React.ReactNode;
};

function RowHighlightedWrapper({
	highlighted,
	children,
}: RowHighlightedWrapperProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (highlighted) {
			ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, [highlighted]);

	return (
		<div
			ref={ref}
			className={cn(
				"scroll-mt-6 rounded-lg",
				highlighted &&
					"animate-highlight-blink ring-primary/40 ring-offset-background ring-1 ring-offset-2"
			)}
		>
			{children}
		</div>
	);
}
