import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";

import { cn } from "../../lib/utils";

const alertVariants = cva(
	"relative flex w-full flex-wrap items-start gap-3 border px-4 py-3 text-sm",
	{
		variants: {
			variant: {
				default: "",
				neutral: "",
				info: "",
				success: "",
				warning: "",
				destructive: "",
			},
			emphasis: {
				light: "",
				bold: "",
			},
			shape: {
				inline: "rounded-md",
				banner: "rounded-none border-x-0 border-t-0",
			},
		},
		compoundVariants: [
			// light emphasis text uses the AA companion tokens (--X-text in
			// globals.css): the vivid base tokens carry the tinted fill and border,
			// but fail 4.5:1 as text on those light surfaces — the -text pairs are the
			// darkened, gamut-checked companions that clear it. bold emphasis flips to
			// the solid fill + its -foreground pair, which is authored for contrast.
			// light — tinted fill, colored -text
			{
				variant: "default",
				emphasis: "light",
				className:
					"bg-primary/15 border-primary/30 text-primary-text [--alert-fg:var(--color-primary-text)]",
			},
			{
				variant: "neutral",
				emphasis: "light",
				// border-border vanishes against the muted fill; 20% foreground stays
				// visible on both light and dark surfaces
				className:
					"bg-muted border-foreground/20 text-foreground [--alert-fg:var(--color-foreground)]",
			},
			{
				variant: "info",
				emphasis: "light",
				className:
					"bg-info/15 border-info/30 text-info-text [--alert-fg:var(--color-info-text)]",
			},
			{
				variant: "success",
				emphasis: "light",
				className:
					"bg-success/15 border-success/30 text-success-text [--alert-fg:var(--color-success-text)]",
			},
			{
				variant: "warning",
				emphasis: "light",
				className:
					"bg-warning/15 border-warning/30 text-warning-text [--alert-fg:var(--color-warning-text)]",
			},
			{
				variant: "destructive",
				emphasis: "light",
				className:
					"bg-destructive/15 border-destructive/30 text-destructive-text [--alert-fg:var(--color-destructive-text)]",
			},
			// bold — solid fill, -foreground pair, transparent border
			{
				variant: "default",
				emphasis: "bold",
				className:
					"bg-primary text-primary-foreground border-transparent [--alert-fg:var(--color-primary-foreground)]",
			},
			{
				variant: "neutral",
				emphasis: "bold",
				className:
					"bg-foreground text-background border-transparent [--alert-fg:var(--color-background)]",
			},
			{
				variant: "info",
				emphasis: "bold",
				className:
					"bg-info text-info-foreground border-transparent [--alert-fg:var(--color-info-foreground)]",
			},
			{
				variant: "success",
				emphasis: "bold",
				className:
					"bg-success text-success-foreground border-transparent [--alert-fg:var(--color-success-foreground)]",
			},
			{
				variant: "warning",
				emphasis: "bold",
				className:
					"bg-warning text-warning-foreground border-transparent [--alert-fg:var(--color-warning-foreground)]",
			},
			{
				variant: "destructive",
				emphasis: "bold",
				className:
					"bg-destructive text-destructive-foreground border-transparent [--alert-fg:var(--color-destructive-foreground)]",
			},
		],
		defaultVariants: {
			variant: "default",
			emphasis: "light",
			shape: "inline",
		},
	}
);

export type AlertVariant = NonNullable<
	VariantProps<typeof alertVariants>["variant"]
>;

// Auto icon per variant. `default`, `neutral`, and `info` all read as
// informational, so they share the Info glyph; the others map to their own
// status glyph. Recolor happens through the alert's own text color.
const alertIcons: Record<AlertVariant, React.ReactNode> = {
	default: <Info />,
	neutral: <Info />,
	info: <Info />,
	success: <CircleCheck />,
	warning: <TriangleAlert />,
	destructive: <CircleAlert />,
};

function Alert({
	className,
	variant = "default",
	emphasis = "light",
	shape = "inline",
	icon,
	action,
	onDismiss,
	dismissLabel = "Dismiss",
	children,
	...props
}: React.ComponentProps<"div"> &
	VariantProps<typeof alertVariants> & {
		icon?: React.ReactNode;
		action?: React.ReactNode;
		onDismiss?: () => void;
		dismissLabel?: string;
	}) {
	// `icon` is intentionally tri-state: undefined = auto per variant,
	// null = no icon at all, any other node = explicit override.
	const resolvedIcon =
		icon === undefined ? alertIcons[variant ?? "default"] : icon;

	return (
		// role set before the spread so consumers can override to role="status".
		<div
			role="alert"
			{...props}
			data-slot="alert"
			data-variant={variant}
			data-emphasis={emphasis}
			className={cn(
				alertVariants({ variant, emphasis, shape }),
				onDismiss && "pe-10",
				className
			)}
		>
			{resolvedIcon != null ? (
				<span
					data-slot="alert-icon"
					className="mt-0.5 size-4 shrink-0 [&>svg]:size-4"
				>
					{resolvedIcon}
				</span>
			) : null}
			{/* min-w-40 (not min-w-0) is the wrap trigger: the content refuses to
			    shrink below a readable measure, so on narrow containers the
			    trailing action slot wraps onto its own row (the root is
			    flex-wrap and gap-3 covers the row gap). The dismiss button is
			    pinned top-right and never participates in the wrap. */}
			<div
				data-slot="alert-content"
				className="flex min-w-40 flex-1 flex-col gap-0.5"
			>
				{children}
			</div>
			{/* Scoped hover for action buttons: the shared outline/ghost hover
			    (beige accent) clashes with the intent tints, so inside an alert
			    the hover surface mixes the alert's own foreground in instead. */}
			{action != null ? (
				<div
					data-slot="alert-action"
					className="ml-3 shrink-0 self-center [&_[data-slot=button][data-variant=ghost]:hover]:bg-[color-mix(in_oklab,var(--alert-fg)_10%,transparent)] [&_[data-slot=button][data-variant=ghost]:hover]:text-[var(--alert-fg)] [&_[data-slot=button][data-variant=outline]:hover]:border-[color-mix(in_oklab,var(--alert-fg)_30%,transparent)] [&_[data-slot=button][data-variant=outline]:hover]:bg-[color-mix(in_oklab,var(--alert-fg)_20%,var(--color-background))]"
				>
					{action}
				</div>
			) : null}
			{onDismiss ? (
				<button
					type="button"
					onClick={onDismiss}
					aria-label={dismissLabel}
					className="focus-visible:ring-ring absolute top-3 right-3 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
				>
					<X className="size-4" />
				</button>
			) : null}
		</div>
	);
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-title"
			className={cn("font-medium", className)}
			{...props}
		/>
	);
}

// Description color inherits from the alert; never add opacity modifiers here —
// they recompute the -text tokens against the fill and break the AA contrast.
function AlertDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return <div data-slot="alert-description" className={className} {...props} />;
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
