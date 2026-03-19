import { useState, useCallback } from "react";
import { CheckpointRow } from "./CheckpointRow";
import type { CheckpointEntry } from "@/modules/checkpoints/domain/checkpoint";

interface CheckpointThreadProps {
	checkpoints: CheckpointEntry[];
	onSelect: (id: string) => void;
}

export function CheckpointThread({
	checkpoints,
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
			{checkpoints.map((checkpoint) => (
				<CheckpointRow
					key={checkpoint.id}
					checkpoint={checkpoint}
					isExpanded={expandedIds.has(checkpoint.id)}
					onSelect={onSelect}
					onToggle={handleToggle}
				/>
			))}
		</div>
	);
}
