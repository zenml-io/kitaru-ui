import type { SpanType } from "@/types/dashboard";
import { ColorDot } from "@/components/ui/color-dot";
import { getSpanFillClass, getSpanTextClass } from "@/lib/span-styles";
import { cn } from "@/lib/utils";

const spanLabels: Record<SpanType, string> = {
	flow: "Flow",
	llm: "LLM",
	checkpoint: "Checkpoint",
	tool: "Tool",
	wait: "Wait",
	sleep: "Sleep",
	parallel: "Parallel",
};

interface SpanDetailHeaderProps {
	type: SpanType;
	name: string;
}

export function SpanDetailHeader({ type, name }: SpanDetailHeaderProps) {
	return (
		<>
			<div
				className={cn(
					"mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase",
					getSpanTextClass(type)
				)}
			>
				<ColorDot className={getSpanFillClass(type)} />
				{spanLabels[type]}
			</div>
			<div className="text-foreground mb-6 font-mono text-lg leading-6 font-bold break-all">
				{name}
			</div>
		</>
	);
}
