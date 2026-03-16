import type { Span, SpanType } from "@/types/dashboard";
import { formatDurationShort, formatCost, formatTokens } from "@/lib/format";
import { getSpanFillClass, getSpanSurfaceClass } from "@/lib/span-styles";
import { ColorDot } from "@/components/ui/color-dot";
import { SectionDivider } from "@/components/ui/section-divider";
import { DetailRow, DetailRows } from "./detail-row";
import { SpanDetailHeader } from "./span-detail-header";

export function SpanDetailFlow({ span }: { span: Span }) {
	const totalCost = span.children.reduce((sum, c) => sum + (c.cost || 0), 0);
	const totalTokens = span.children.reduce(
		(sum, c) => sum + (c.tokens ? c.tokens.input + c.tokens.output : 0),
		0
	);

	const typeCounts = span.children.reduce(
		(acc, c) => {
			acc[c.type] = (acc[c.type] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>
	);

	return (
		<div className="p-6">
			<SpanDetailHeader type="flow" name={span.name} />

			<DetailRows>
				<DetailRow label="Duration" className="tabular-nums">
					{formatDurationShort(span.durationMs)}
				</DetailRow>
				<DetailRow label="Total Cost" className="tabular-nums">
					{formatCost(totalCost)}
				</DetailRow>
				<DetailRow label="Total Tokens" className="tabular-nums">
					{formatTokens(totalTokens)}
				</DetailRow>
				<DetailRow label="Steps">{span.children.length}</DetailRow>
			</DetailRows>

			{/* Primitive pills */}
			<SectionDivider>Primitives</SectionDivider>
			<div className="flex flex-wrap gap-2">
				{Object.entries(typeCounts).map(([type, count]) => (
					<div
						key={type}
						className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs ${getSpanSurfaceClass(type as SpanType)}`}
					>
						<ColorDot
							size="xs"
							className={getSpanFillClass(type as SpanType)}
						/>
						<span className="text-foreground font-semibold">{count}</span>
						<span className="text-muted-foreground">{type}</span>
					</div>
				))}
			</div>
		</div>
	);
}
