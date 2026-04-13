import type { ReactNode } from "react";
import { cn } from "@/shared/utils/styles";

type DetailItemProps = {
	label: string;
	children: ReactNode;
	className?: string;
};

export function DetailItem({ label, children, className }: DetailItemProps) {
	return (
		<>
			<dt className="text-muted-foreground wrap-anywhere">{label}</dt>
			<dd className={cn("min-w-0 wrap-anywhere", className)}>{children}</dd>
		</>
	);
}
