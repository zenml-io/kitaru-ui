import { LockKeyhole } from "lucide-react";
import { cn } from "@zenml/hashi/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@zenml/hashi/primitives/tooltip";

export type LockedResourceTagProps = {
	name: string;
	className?: string;
};

export function LockedResourceTag({
	name,
	className,
}: LockedResourceTagProps) {
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<span
						className={cn(
							"border-border bg-muted/50 text-muted-foreground inline-flex h-6 max-w-full items-center gap-1.5 rounded-md border px-2 font-mono text-xs",
							className
						)}
					/>
				}
			>
				<LockKeyhole className="size-3 shrink-0" aria-hidden />
				<span className="truncate">{name}</span>
			</TooltipTrigger>
			<TooltipContent>You do not have access to this resource.</TooltipContent>
		</Tooltip>
	);
}
