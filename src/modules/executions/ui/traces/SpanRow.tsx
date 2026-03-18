import { cn } from "@/shared/utils/styles";
import { formatDurationShort } from "@/shared/utils/time";
import { CheckpointTypeDot } from "@/modules/checkpoints/ui/CheckpointTypeIndicator";
import type { Span } from "@/modules/executions/domain/span";

interface SpanRowProps {
	span: Span;
	isSelected: boolean;
	totalMs: number;
	onSelect: (id: string) => void;
}

export function SpanRow({ span, isSelected, totalMs, onSelect }: SpanRowProps) {
	const leftPct = totalMs > 0 ? (span.startMs / totalMs) * 100 : 0;
	const widthPct =
		totalMs > 0 ? Math.max((span.durationMs / totalMs) * 100, 0.5) : 0;

	return (
		<button
			type="button"
			className={cn(
				"border-border relative flex h-10 w-full items-center border-b transition-colors",
				isSelected ? "bg-accent" : "hover:bg-accent/30"
			)}
			onClick={() => onSelect(span.id)}
		>
			{isSelected && (
				<div className="bg-primary absolute inset-y-0 left-0 w-[3px]" />
			)}

			<div className="flex w-full items-center">
				<div
					className="flex shrink-0 items-center gap-2 overflow-hidden pl-3"
					style={{ width: 240 }}
				>
					{span.type && <CheckpointTypeDot type={span.type} />}
					<span className="text-foreground truncate font-mono text-xs">
						{span.name}
					</span>
				</div>

				<div className="relative flex flex-1 items-center pr-6">
					<div className="bg-foreground/10 relative h-3.5 flex-1 rounded-sm">
						{span.durationMs > 0 && (
							<div
								className={cn(
									"bg-primary absolute top-0 h-full min-w-[3px] rounded-sm"
								)}
								style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
							/>
						)}
					</div>
					<span
						className={cn(
							"ml-2 w-14 shrink-0 text-right font-mono text-xs tabular-nums",
							isSelected
								? "text-primary font-semibold"
								: "text-muted-foreground"
						)}
					>
						{span.durationMs > 0 ? formatDurationShort(span.durationMs) : "—"}
					</span>
				</div>
			</div>
		</button>
	);
}
