import type { ReactElement, ReactNode } from "react";
import { useRender } from "@base-ui/react/use-render";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@zenml/hashi/primitives/dropdown-menu";
import { cn } from "@zenml/hashi/lib/utils";

// Shared breadcrumb switcher pill: label half + divider + chevron dropdown
// trigger, wired to a DropdownMenu whose content is `children`.
//
// `labelRender` lets the caller provide integration-specific wrappers (for
// example `Link` from react-router) while this component stays pure UI.
export function SwitcherPill({
	labelRender,
	labelAriaLabel,
	triggerAriaLabel,
	label,
	className,
	contentClassName,
	children,
}: {
	labelRender?: ReactElement;
	labelAriaLabel: string;
	triggerAriaLabel: string;
	label: ReactNode;
	className?: string;
	contentClassName?: string;
	children: ReactNode;
}) {
	const labelClassName = cn(
		"inline-flex h-7 items-center gap-1.5 rounded-l-md pr-2 pl-2.5",
		"text-foreground text-sm font-semibold no-underline",
		"hover:bg-accent/40 transition-colors",
		"focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none",
		!labelRender && "cursor-default"
	);

	// `aria-label` is only meaningful on the actionable (linked) variant —
	// applying it to a roleless fallback `<div>` would announce a labeled
	// region with no available action. The label text self-narrates in that
	// case.
	const labelElement = useRender({
		render: labelRender ?? <div />,
		props: {
			className: labelClassName,
			children: label,
			...(labelRender ? { "aria-label": labelAriaLabel } : {}),
		},
	});

	return (
		<DropdownMenu>
			<div className={cn("inline-flex h-7 items-center rounded-md", className)}>
				{labelElement}
				<DropdownMenuTrigger
					render={
						<button
							type="button"
							aria-label={triggerAriaLabel}
							className={cn(
								"inline-flex h-7 w-6 items-center justify-center rounded-r-md",
								"hover:bg-accent/40 transition-colors",
								"focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none",
								"data-[popup-open]:bg-accent/60"
							)}
						>
							<ChevronsUpDown
								className="text-muted-foreground size-3 shrink-0"
								aria-hidden
							/>
						</button>
					}
				/>
			</div>
			<DropdownMenuContent
				align="start"
				sideOffset={6}
				className={cn("w-[320px] p-0", contentClassName)}
			>
				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// Punctuation between adjacent breadcrumb pills.
export function SlashSeparator() {
	return (
		<span
			className="text-border mx-1 shrink-0 text-base font-light select-none"
			aria-hidden
		>
			/
		</span>
	);
}

// Standard "no matches" copy for switcher dropdowns.
export function SwitcherEmpty({
	noun,
	query,
}: {
	noun: string;
	query: string;
}) {
	return (
		<p className="text-muted-foreground px-3 py-6 text-center text-xs italic">
			No {noun} match &ldquo;{query}&rdquo;.
		</p>
	);
}

// Shared row chrome for the breadcrumb switcher dropdowns. Owns the
// `data-active` attribute, the active-row tint, and the trailing check or
// equivalent-width spacer so the row's right edge doesn't shift between
// states. Each caller supplies only its own middle content.
export function SwitcherRow({
	active,
	onSelect,
	children,
}: {
	active: boolean;
	onSelect: () => void;
	children: ReactNode;
}) {
	return (
		<DropdownMenuItem
			onClick={onSelect}
			data-active={active ? "" : undefined}
			className={cn(
				"flex items-center gap-2.5 py-1.5",
				active && "bg-accent/60"
			)}
		>
			{children}
			{active ? (
				<Check className="text-foreground size-3.5 shrink-0" aria-hidden />
			) : (
				<span className="size-3.5 shrink-0" aria-hidden />
			)}
		</DropdownMenuItem>
	);
}
