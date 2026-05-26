import * as React from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@zenml/hashi/primitives/tooltip";
import { cn } from "@/shared/utils/styles";

function isOverflowing(el: HTMLElement): boolean {
	const range = document.createRange();
	range.selectNodeContents(el);
	return range.getBoundingClientRect().width > el.getBoundingClientRect().width;
}

type TruncatedTextProps = React.ComponentProps<"span"> & {
	tooltipLabel?: string;
};

function TruncatedText({
	children,
	className,
	tooltipLabel,
	...props
}: TruncatedTextProps) {
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
			<TooltipContent>{tooltipLabel ?? children}</TooltipContent>
		</Tooltip>
	);
}

export { TruncatedText };
