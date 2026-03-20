import type { ComponentProps } from "react";
import { cn } from "../utils/styles";

type TableToolbarProps = ComponentProps<"div">;

function TableToolbarRoot({ className, ...props }: TableToolbarProps) {
	return (
		<div
			className={cn("border-border w-full border-b", className)}
			{...props}
		/>
	);
}

function TableToolbarContent({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"container mx-auto flex w-full flex-wrap items-center gap-2 px-4 py-3 sm:px-6 lg:px-8",
				className
			)}
			{...props}
		/>
	);
}

export { TableToolbarContent, TableToolbarRoot };
