import { useState, type ComponentProps } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@zenml/hashi/primitives/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@zenml/hashi/primitives/tooltip";
import { useCopy } from "@zenml/hashi/hooks/use-copy";

type ButtonProps = ComponentProps<typeof Button>;

type CopyButtonProps = Omit<ButtonProps, "onClick" | "children"> & {
	/** Text written to the clipboard. */
	text: string;
	/** Tooltip label when idle. */
	label?: string;
	/** Tooltip label shown briefly after a successful copy. */
	copiedLabel?: string;
	/** How long the copied state stays before resetting. */
	resetDelayMs?: number;
	tooltipSide?: "top" | "bottom" | "left" | "right";
};

export function CopyButton({
	text,
	label = "Copy to clipboard",
	copiedLabel = "Copied!",
	resetDelayMs = 1500,
	variant = "ghost",
	size = "icon-sm",
	tooltipSide = "bottom",
	...rest
}: CopyButtonProps) {
	const { copied, copy } = useCopy();
	const [hovered, setHovered] = useState(false);

	return (
		<Tooltip open={hovered || copied} onOpenChange={setHovered}>
			<TooltipTrigger
				render={
					<Button
						variant={variant}
						size={size}
						aria-label={label}
						onClick={() => copy(text, { delay: resetDelayMs })}
						{...rest}
					/>
				}
			>
				{copied ? (
					<Check className="text-success size-3.5" />
				) : (
					<Copy className="size-3.5" />
				)}
			</TooltipTrigger>
			<TooltipContent side={tooltipSide}>
				{copied ? copiedLabel : label}
			</TooltipContent>
		</Tooltip>
	);
}
