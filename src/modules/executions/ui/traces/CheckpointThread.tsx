import { CheckpointRow } from "./CheckpointRow";
import { WaitingBlockRow } from "./WaitingBlockRow";
import type { TimelineEntry } from "../../domain/waiting-block";

interface CheckpointThreadProps {
	timelineEntries: TimelineEntry[];
	onSelect: (id: string) => void;
}

export function CheckpointThread({
	timelineEntries,
	onSelect,
}: CheckpointThreadProps) {
	return (
		<div className="flex-1 space-y-3 overflow-y-auto p-6">
			{timelineEntries.map((entry) =>
				entry.kind === "waiting" ? (
					<WaitingBlockRow key={entry.data.id} waitingBlock={entry.data} />
				) : (
					<CheckpointRow
						key={entry.data.id}
						checkpointEntry={entry.data}
						onSelect={onSelect}
					/>
				)
			)}
		</div>
	);
}
