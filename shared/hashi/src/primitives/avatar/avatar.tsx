import * as React from "react";

import { cn } from "../../lib/utils";

type ImageLoadingStatus = "loading" | "loaded" | "error";

const AvatarContext = React.createContext<{
	status: ImageLoadingStatus;
	setStatus: (status: ImageLoadingStatus) => void;
}>({ status: "loading", setStatus: () => {} });

const AVATAR_SQUARE_RADII =
	"data-[shape=square]:data-[size=sm]:rounded-sm data-[shape=square]:data-[size=default]:rounded-sm data-[shape=square]:data-[size=lg]:rounded-md data-[shape=square]:data-[size=xl]:rounded-md data-[shape=square]:data-[size=2xl]:rounded-lg";

const AVATAR_FALLBACK_SQUARE_RADII =
	"group-data-[shape=square]/avatar:group-data-[size=sm]/avatar:rounded-sm group-data-[shape=square]/avatar:group-data-[size=default]/avatar:rounded-sm group-data-[shape=square]/avatar:group-data-[size=lg]/avatar:rounded-md group-data-[shape=square]/avatar:group-data-[size=xl]/avatar:rounded-md group-data-[shape=square]/avatar:group-data-[size=2xl]/avatar:rounded-lg";

const AVATAR_GROUP_COUNT_SQUARE_RADII =
	"data-[shape=square]:rounded-sm data-[shape=square]:group-has-data-[size=lg]/avatar-group:rounded-md data-[shape=square]:group-has-data-[size=xl]/avatar-group:rounded-md data-[shape=square]:group-has-data-[size=2xl]/avatar-group:rounded-lg";

function Avatar({
	className,
	size = "default",
	shape = "circle",
	children,
	...props
}: React.ComponentProps<"span"> & {
	size?: "default" | "sm" | "lg" | "xl" | "2xl";
	shape?: "circle" | "square";
}) {
	const [status, setStatus] = React.useState<ImageLoadingStatus>("loading");

	// Only expose an `img` role when the avatar carries its own text
	// alternative; a bare/decorative avatar (labeled by adjacent text) stays
	// role-less so it isn't announced as an unnamed image. A caller-supplied
	// `role` in props still wins via spread order below.
	const hasLabel =
		props["aria-label"] != null || props["aria-labelledby"] != null;

	return (
		<AvatarContext.Provider value={{ status, setStatus }}>
			<span
				data-slot="avatar"
				data-size={size}
				data-shape={shape}
				role={hasLabel ? "img" : undefined}
				className={cn(
					"group/avatar relative flex size-8 shrink-0 overflow-hidden select-none data-[shape=circle]:rounded-full data-[size=2xl]:size-20 data-[size=lg]:size-10 data-[size=sm]:size-6 data-[size=xl]:size-12",
					AVATAR_SQUARE_RADII,
					className
				)}
				{...props}
			>
				{children}
			</span>
		</AvatarContext.Provider>
	);
}

function AvatarImage({
	className,
	src,
	alt,
	onLoad,
	onError,
	...props
}: React.ComponentProps<"img">) {
	const { status, setStatus } = React.useContext(AvatarContext);

	React.useEffect(() => {
		if (src) {
			setStatus("loading");
		} else {
			setStatus("error");
		}
	}, [src, setStatus]);

	if (status === "error" || !src) return null;

	return (
		<img
			data-slot="avatar-image"
			src={src}
			alt={alt}
			className={cn("aspect-square size-full", className)}
			onLoad={(e) => {
				setStatus("loaded");
				onLoad?.(e);
			}}
			onError={(e) => {
				setStatus("error");
				onError?.(e);
			}}
			{...props}
		/>
	);
}

function AvatarFallback({
	className,
	children,
	...props
}: React.ComponentProps<"span">) {
	const { status } = React.useContext(AvatarContext);

	if (status === "loaded") return null;

	return (
		<span
			data-slot="avatar-fallback"
			className={cn(
				"bg-muted text-muted-foreground flex size-full items-center justify-center text-sm group-data-[shape=circle]/avatar:rounded-full group-data-[size=2xl]/avatar:text-2xl group-data-[size=sm]/avatar:text-xs group-data-[size=xl]/avatar:text-base",
				AVATAR_FALLBACK_SQUARE_RADII,
				className
			)}
			{...props}
		>
			{children}
		</span>
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
				"bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=xl]/avatar-group:size-12 data-[shape=circle]:rounded-full [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
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
