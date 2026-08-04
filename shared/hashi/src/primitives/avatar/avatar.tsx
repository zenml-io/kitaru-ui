import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const avatarVariants = cva(
	"group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-black/10 after:mix-blend-multiply dark:after:border-white/10 dark:after:mix-blend-screen",
	{
		variants: {
			size: {
				sm: "size-6",
				default: "size-8",
				lg: "size-10",
				xl: "size-12",
				"2xl": "size-20",
			},
			shape: {
				circle: "rounded-full",
				square: "",
			},
		},
		compoundVariants: [
			{ size: ["sm", "default"], shape: "square", className: "rounded-sm" },
			{ size: ["lg", "xl"], shape: "square", className: "rounded-md" },
			{ size: "2xl", shape: "square", className: "rounded-lg" },
		],
	}
);

const AVATAR_GROUP_COUNT_SQUARE_RADII =
	"data-[shape=square]:rounded-sm data-[shape=square]:group-has-data-[size=lg]/avatar-group:rounded-md data-[shape=square]:group-has-data-[size=xl]/avatar-group:rounded-md data-[shape=square]:group-has-data-[size=2xl]/avatar-group:!rounded-lg";

function Avatar({
	className,
	size = "default",
	shape = "circle",
	children,
	...props
}: AvatarPrimitive.Root.Props & {
	size?: "default" | "sm" | "lg" | "xl" | "2xl";
	shape?: "circle" | "square";
}) {
	return (
		<AvatarPrimitive.Root
			data-slot="avatar"
			data-size={size}
			data-shape={shape}
			className={cn(avatarVariants({ size, shape }), className)}
			{...props}
		>
			{children}
		</AvatarPrimitive.Root>
	);
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
	return (
		<AvatarPrimitive.Image
			data-slot="avatar-image"
			className={cn(
				"aspect-square size-full overflow-hidden rounded-[inherit] object-cover",
				className
			)}
			{...props}
		/>
	);
}

function AvatarFallback({
	className,
	...props
}: AvatarPrimitive.Fallback.Props) {
	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn(
				"bg-muted text-muted-foreground flex size-full items-center justify-center overflow-hidden rounded-[inherit] text-sm group-data-[size=2xl]/avatar:text-2xl group-data-[size=sm]/avatar:text-xs group-data-[size=xl]/avatar:text-base",
				className
			)}
			{...props}
		/>
	);
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="avatar-badge"
			className={cn(
				"bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 select-none",
				"group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
				"group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
				"group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
				"group-data-[size=xl]/avatar:size-3.5 group-data-[size=xl]/avatar:[&>svg]:size-2.5",
				"group-data-[size=2xl]/avatar:size-5 group-data-[size=2xl]/avatar:[&>svg]:size-3",
				className
			)}
			{...props}
		/>
	);
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="avatar-group"
			className={cn(
				"group/avatar-group *:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2",
				className
			)}
			{...props}
		/>
	);
}

function AvatarGroupCount({
	className,
	shape = "circle",
	...props
}: React.ComponentProps<"div"> & {
	shape?: "circle" | "square";
}) {
	return (
		<div
			data-slot="avatar-group-count"
			data-shape={shape}
			className={cn(
				"bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center text-sm ring-2 group-has-data-[size=2xl]/avatar-group:!size-20 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=xl]/avatar-group:size-12 data-[shape=circle]:rounded-full [&>svg]:size-4 group-has-data-[size=2xl]/avatar-group:[&>svg]:!size-8 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3 group-has-data-[size=xl]/avatar-group:[&>svg]:size-6",
				AVATAR_GROUP_COUNT_SQUARE_RADII,
				className
			)}
			{...props}
		/>
	);
}

export {
	Avatar,
	AvatarImage,
	AvatarFallback,
	AvatarBadge,
	AvatarGroup,
	AvatarGroupCount,
};
