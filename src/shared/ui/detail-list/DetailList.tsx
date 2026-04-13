import type { ReactNode } from "react";
import { cn } from "@/shared/utils/styles";

type DetailListProps = {
	children: ReactNode;
	className?: string;
};

export function DetailList({ children, className }: DetailListProps) {
	return (
		<dl
			className={cn(
				"grid grid-cols-[6rem_minmax(0,1fr)] gap-x-4 gap-y-2 text-xs",
				className
			)}
		>
			{children}
		</dl>
	);
}
