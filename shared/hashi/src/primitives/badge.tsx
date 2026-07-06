import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";

import { cn } from "../lib/utils";

const badgeVariants = cva(
	"inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent px-2 py-0.5 font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
				secondary:
					"bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
				destructive:
					"bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
				outline:
					"border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
				ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
				link: "text-primary underline-offset-4 [a&]:hover:underline",
				success: "bg-success text-success-foreground [a&]:hover:bg-success/90",
				warning: "bg-warning text-warning-foreground [a&]:hover:bg-warning/90",
				info: "bg-info text-info-foreground [a&]:hover:bg-info/90",
				teal: "bg-accent-teal text-accent-teal-foreground",
				neutral: "bg-muted text-muted-foreground",
				// solid fill uses the AA companion: base --status-archived is a mid-gray
				// (L 0.58) on which no text color can reach 4.5:1
				archived: "bg-status-archived-text text-white",
			},
			emphasis: {
				bold: "",
				light: "",
				neutral: "",
				ghost: "",
			},
			radius: {
				full: "rounded-full",
				sm: "rounded-sm",
			},
			size: {
				default: "text-xs",
				xs: "text-2xs",
			},
		},
		compoundVariants: [
			// light/neutral/ghost text uses the AA companion tokens (--X-text in
			// globals.css): the vivid base tokens stay on dots and solid fills but
			// fail 4.5:1 as text on tinted/beige/white surfaces.
			// light — tinted fill, colored text
			{
				variant: "default",
				emphasis: "light",
				className: "border-0 bg-primary/15 text-primary-text",
			},
			{
				variant: "destructive",
				emphasis: "light",
				className:
					"border-0 bg-destructive/15 text-destructive-text dark:bg-destructive/15",
			},
			{
				variant: "success",
				emphasis: "light",
				className: "border-0 bg-success/15 text-success-text",
			},
			{
				variant: "warning",
				emphasis: "light",
				className: "border-0 bg-warning/15 text-warning-text",
			},
			{
				variant: "info",
				emphasis: "light",
				className: "border-0 bg-info/15 text-info-text",
			},
			{
				variant: "teal",
				emphasis: "light",
				className: "border-0 bg-accent-teal/15 text-accent-teal-text",
			},
			{
				variant: "neutral",
				emphasis: "light",
				className: "border-0 bg-muted text-muted-foreground",
			},
			{
				variant: "archived",
				emphasis: "light",
				className: "border-0 bg-status-archived/15 text-status-archived-text",
			},
			// neutral — beige secondary fill (globals.css override), colored text
			{
				variant: "default",
				emphasis: "neutral",
				className: "border-0 bg-secondary text-primary-text",
			},
			{
				variant: "destructive",
				emphasis: "neutral",
				className: "border-0 bg-secondary text-destructive-text",
			},
			{
				variant: "success",
				emphasis: "neutral",
				className: "border-0 bg-secondary text-success-text",
			},
			{
				variant: "warning",
				emphasis: "neutral",
				className: "border-0 bg-secondary text-warning-text",
			},
			{
				variant: "info",
				emphasis: "neutral",
				className: "border-0 bg-secondary text-info-text",
			},
			{
				variant: "teal",
				emphasis: "neutral",
				className: "border-0 bg-secondary text-accent-teal-text",
			},
			{
				variant: "neutral",
				emphasis: "neutral",
				className: "border-0 bg-secondary text-muted-foreground",
			},
			{
				variant: "archived",
				emphasis: "neutral",
				className: "border-0 bg-secondary text-status-archived-text",
			},
			// ghost — transparent fill, colored text
			{
				variant: "default",
				emphasis: "ghost",
				className: "border-0 bg-transparent text-primary-text",
			},
			{
				variant: "destructive",
				emphasis: "ghost",
				className: "border-0 bg-transparent text-destructive-text",
			},
			{
				variant: "success",
				emphasis: "ghost",
				className: "border-0 bg-transparent text-success-text",
			},
			{
				variant: "warning",
				emphasis: "ghost",
				className: "border-0 bg-transparent text-warning-text",
			},
			{
				variant: "info",
				emphasis: "ghost",
				className: "border-0 bg-transparent text-info-text",
			},
			{
				variant: "teal",
				emphasis: "ghost",
				className: "border-0 bg-transparent text-accent-teal-text",
			},
			{
				variant: "neutral",
				emphasis: "ghost",
				className: "border-0 bg-transparent text-muted-foreground",
			},
			{
				variant: "archived",
				emphasis: "ghost",
				className: "border-0 bg-transparent text-status-archived-text",
			},
		],
		defaultVariants: {
			variant: "default",
			emphasis: "bold",
			radius: "full",
			size: "default",
		},
	}
);

function Badge({
	className,
	variant = "default",
	emphasis = "bold",
	radius = "full",
	size = "default",
	render,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & {
		render?: useRender.ComponentProps<"span">["render"];
	}) {
	const defaultProps = {
		"data-slot": "badge",
		"data-variant": variant,
		"data-emphasis": emphasis,
		className: cn(badgeVariants({ variant, emphasis, radius, size }), className),
	} as React.ComponentProps<"span">;

	const element = useRender({
		render: render ?? <span />,
		props: mergeProps<"span">(defaultProps, props),
	});

	return element;
}

export { Badge, badgeVariants };
export type BadgeVariant = NonNullable<
	VariantProps<typeof badgeVariants>["variant"]
>;
