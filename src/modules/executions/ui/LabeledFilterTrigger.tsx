import type { ReactNode } from "react";
import { SelectTrigger, SelectValue } from "@/shared/ui/select";
import { cn } from "@/shared/utils/styles";

type LabeledFilterTriggerProps = {
	label: string;
	displayValue?: ReactNode;
	className?: string;
};

export function LabeledFilterTrigger({
	label,
	displayValue,
	className,
}: LabeledFilterTriggerProps) {
	return (
		<SelectTrigger
			size="sm"
			className={cn("w-auto bg-transparent px-2.5", className)}
		>
			<SelectValue
				render={() => (
					<>
						<span className="text-muted-foreground text-xs font-medium">
							{label}
						</span>
						{displayValue !== undefined && displayValue !== null && (
							<span className="text-foreground ml-1 truncate text-xs">
								{displayValue}
							</span>
						)}
					</>
				)}
			/>
		</SelectTrigger>
	);
}
