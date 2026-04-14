import * as React from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn } from "@/shared/utils/styles";

function isOverflowing(el: HTMLElement): boolean {
	const range = document.createRange();
	range.selectNodeContents(el);
	return range.getBoundingClientRect().width > el.getBoundingClientRect().width;
}

function TruncatedText({
	children,
	className,
	...props
}: React.ComponentProps<"span">) {
	const ref = React.useRef<HTMLSpanElement>(null);
	const [open, setOpen] = React.useState(false);

	return (
		<Tooltip
			open={open}
			onOpenChange={(next) => {
				setOpen(next && !!ref.current && isOverflowing(ref.current));
			}}
		>
			<TooltipTrigger
				render={
					<span
						ref={ref}
						data-slot="truncated-text"
						className={cn("block truncate", className)}
						{...props}
					>
						{children}
					</span>
				}
			/>
			<TooltipContent>{children}</TooltipContent>
		</Tooltip>
	);
}

export { TruncatedText };
