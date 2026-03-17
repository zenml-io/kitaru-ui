import { SpanRow } from "./span-row";
import type { Span } from "./span-types";

interface TimelineSpansProps {
	spans: Span[];
	totalMs: number;
	selectedId?: string;
	onSelect: (id: string) => void;
}

export function TimelineSpans({
	spans,
	totalMs,
	selectedId,
	onSelect,
}: TimelineSpansProps) {
	return (
		<div className="overflow-x-hidden">
			{spans.map((span) => (
				<SpanRow
					key={span.id}
					span={span}
					isSelected={selectedId === span.id}
					totalMs={totalMs}
					onSelect={onSelect}
				/>
			))}
		</div>
	);
}
