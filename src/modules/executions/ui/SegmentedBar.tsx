import * as React from "react";
import { cn } from "@/shared/utils/styles";

export interface BarSegment {
	key: string;
	label: React.ReactNode;
	value: number;
	className: string;
	textClassName?: string;
	minWidth?: string;
}

export interface SegmentedBarProps {
	segments: BarSegment[];
	height?: string;
	gap?: boolean;
	className?: string;
}

export function SegmentedBar({
	segments,
	height = "h-7",
	gap = false,
	className,
}: SegmentedBarProps) {
	const total = segments.reduce((sum, seg) => sum + seg.value, 0);

	if (total === 0) {
		return (
			<div
				className={cn("flex w-full overflow-hidden rounded", height, className)}
			/>
		);
	}

	return (
		<div
			className={cn(
				"flex w-full overflow-hidden rounded",
				gap && "gap-px",
				height,
				className
			)}
		>
			{segments.map((seg) => {
				const pct = (seg.value / total) * 100;
				return (
					<div
						key={seg.key}
						className={cn(
							"text-2xs flex items-center justify-center px-2 font-mono font-semibold tabular-nums",
							seg.className,
							seg.textClassName ?? "text-white",
							seg.minWidth
						)}
						style={{ width: `${pct}%` }}
					>
						{seg.label}
					</div>
				);
			})}
		</div>
	);
}
