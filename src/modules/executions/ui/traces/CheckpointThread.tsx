import { CheckpointRow } from "./CheckpointRow";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";

interface CheckpointThreadProps {
	checkpointsEntries: CheckpointEntry[];
	onSelect: (id: string) => void;
}

export function CheckpointThread({
	checkpointsEntries,
	onSelect,
}: CheckpointThreadProps) {
	return (
		<div className="flex-1 space-y-3 overflow-y-auto p-6">
			{checkpointsEntries.map((checkpointEntry) => (
				<CheckpointRow
					key={checkpointEntry.id}
					checkpointEntry={checkpointEntry}
					onSelect={onSelect}
				/>
			))}
		</div>
	);
}
