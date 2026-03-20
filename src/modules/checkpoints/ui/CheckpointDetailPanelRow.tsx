import type { ReactNode } from "react";
import { cn } from "@/shared/utils/styles";

interface CheckpointDetailPanelRowProps {
	label: string;
	children: ReactNode;
	className?: string;
}

export function CheckpointDetailPanelRow({
	label,
	children,
	className,
}: CheckpointDetailPanelRowProps) {
	return (
		<div className="flex items-center justify-between gap-4 py-2">
			<span className="text-muted-foreground text-xs">{label}</span>
			<span className={cn("font-mono text-xs font-medium", className)}>
				{children}
			</span>
		</div>
	);
}

export function CheckpointDetailPanelRows({
	children,
}: {
	children: ReactNode;
}) {
	return <div className="divide-border flex flex-col divide-y">{children}</div>;
}
