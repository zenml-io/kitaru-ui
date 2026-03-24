import { useState, useCallback } from "react";
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
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

	const handleToggle = useCallback((id: string) => {
		setExpandedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}, []);

	return (
		<div className="flex-1 space-y-3 overflow-y-auto p-6">
			{checkpointsEntries.map((checkpointEntry) => (
				<CheckpointRow
					key={checkpointEntry.id}
					checkpointEntry={checkpointEntry}
					isExpanded={expandedIds.has(checkpointEntry.id)}
					onSelect={onSelect}
					onToggle={handleToggle}
				/>
			))}
		</div>
	);
}
