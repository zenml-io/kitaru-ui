import { SpanRow } from "./span-row";
import type { Span } from "./span-types";

interface SpanTreeProps {
	spans: Span[];
	totalMs: number;
	selectedId: string | null;
	onSelect: (id: string) => void;
}

export function SpanTree({
	spans,
	totalMs,
	selectedId,
	onSelect,
}: SpanTreeProps) {
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
