import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DetailRowProps {
	label: string;
	children: ReactNode;
	className?: string;
}

export function DetailRow({ label, children, className }: DetailRowProps) {
	return (
		<div className="flex items-center justify-between py-2">
			<span className="text-muted-foreground text-xs">{label}</span>
			<span className={cn("font-mono text-xs font-medium", className)}>
				{children}
			</span>
		</div>
	);
}

export function DetailRows({ children }: { children: ReactNode }) {
	return <div className="divide-border flex flex-col divide-y">{children}</div>;
}
