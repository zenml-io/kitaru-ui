import { SpanRow } from "./SpanRow";
import type { Span } from "@/modules/executions/domain/span";

type TimelineSpansProps = {
	spans: Span[];
	totalMs: number;
	selectedId?: string;
	onSelect: (id: string) => void;
};

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
