import { cn } from "@/shared/utils/styles";

interface ColorDotProps extends React.ComponentProps<"span"> {
	shape?: "round" | "square";
	size?: "xs" | "sm" | "md";
}

export function ColorDot({
	shape = "square",
	size = "sm",
	className,
	...props
}: ColorDotProps) {
	return (
		<span
			className={cn(
				"inline-block shrink-0",
				shape === "round" ? "rounded-full" : "rounded-sm",
				size === "xs" && "h-1.5 w-1.5",
				size === "sm" && "h-2 w-2",
				size === "md" && "h-2.5 w-2.5",
				className
			)}
			{...props}
		/>
	);
}
