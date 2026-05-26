import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { Toggle as ToggleItemPrimitive } from "@base-ui/react/toggle";

import { cn } from "../lib/utils";
import { toggleVariants } from "./toggle";

const ToggleGroupContext = React.createContext<
	VariantProps<typeof toggleVariants> & {
		spacing?: number;
	}
>({
	size: "default",
	variant: "default",
	spacing: 0,
});

function ToggleGroup({
	className,
	variant,
	size,
	spacing = 0,
	children,
	value,
	onValueChange,
	...props
}: Omit<
	React.ComponentProps<typeof ToggleGroupPrimitive>,
	"value" | "onValueChange"
> &
	VariantProps<typeof toggleVariants> & {
		spacing?: number;
		value?: string;
		onValueChange?: (value: string) => void;
	}) {
	return (
		<ToggleGroupPrimitive
			data-slot="toggle-group"
			data-variant={variant}
			data-size={size}
			data-spacing={spacing}
			style={{ "--gap": spacing } as React.CSSProperties}
			className={cn(
				"group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md",
				className
			)}
			value={value ? [value] : []}
			onValueChange={(newValue) => {
				if (onValueChange && newValue.length > 0) {
					onValueChange(newValue[newValue.length - 1]!);
				}
			}}
			{...props}
		>
			<ToggleGroupContext.Provider value={{ variant, size, spacing }}>
				{children}
			</ToggleGroupContext.Provider>
		</ToggleGroupPrimitive>
	);
}

function ToggleGroupItem({
	className,
	children,
	variant,
	size,
	...props
}: React.ComponentProps<typeof ToggleItemPrimitive> &
	VariantProps<typeof toggleVariants>) {
	const context = React.useContext(ToggleGroupContext);

	return (
		<ToggleItemPrimitive
			data-slot="toggle-group-item"
			data-variant={context.variant || variant}
			data-size={context.size || size}
			data-spacing={context.spacing}
			className={cn(
				toggleVariants({
					variant: context.variant || variant,
					size: context.size || size,
				}),
				"w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10",
				"data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l",
				className
			)}
			{...props}
		>
			{children}
		</ToggleItemPrimitive>
	);
}

export { ToggleGroup, ToggleGroupItem };
