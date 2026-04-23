import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../utils/styles";

type WarningBannerProps = {
	children: ReactNode;
	className?: string;
};

export function WarningBanner({ children, className }: WarningBannerProps) {
	return (
		<div
			className={cn(
				"bg-warning/10 text-foreground border-warning/40 flex items-start gap-2 rounded-md border p-3 text-sm",
				className
			)}
		>
			<TriangleAlert className="text-warning mt-0.5 size-4 shrink-0" />
			<div className="min-w-0 flex-1">{children}</div>
		</div>
	);
}
