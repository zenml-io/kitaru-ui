import * as React from "react";
import { useRender } from "@base-ui/react/use-render";

import { Button } from "@zenml/hashi/primitives/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@zenml/hashi/primitives/tooltip";

type ButtonProps = React.ComponentProps<typeof Button>;

interface IconButtonProps extends Omit<
	React.ComponentProps<"button">,
	"children"
> {
	icon: React.ReactNode;
	label: string;
	variant?: ButtonProps["variant"];
	size?: ButtonProps["size"];
	tooltipSide?: "top" | "bottom" | "left" | "right";
	render?: useRender.ComponentProps<"button">["render"];
}

function IconButton({
	icon,
	label,
	variant = "ghost",
	size = "icon-sm",
	tooltipSide = "bottom",
	render,
	...rest
}: IconButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button
						render={render}
						variant={variant}
						size={size}
						aria-label={label}
						{...rest}
					/>
				}
			>
				{icon}
			</TooltipTrigger>
			<TooltipContent side={tooltipSide}>{label}</TooltipContent>
		</Tooltip>
	);
}

export { IconButton };
export type { IconButtonProps };
