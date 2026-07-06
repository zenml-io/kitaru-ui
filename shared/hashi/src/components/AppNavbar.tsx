import type { ReactNode } from "react";
import { cn } from "@zenml/hashi/lib/utils";

// App-level navbar shell. Pure presentational chrome — no router, no data.
// Hosts two regions: `leading` (left, grows to fill space with `min-w-0` so
// children can truncate) and `trailing` (right, fixed-width content like
// tabs / user menu).
//
// `px-5` and `h-12` are coupled to `NavbarBrandSlot` (which uses `-ml-5` to
// eat the padding and `h-12` to align the divider). `bg-card`/`border-b`
// are pure chrome and safe to override via `className`.
export function AppNavbar({
	leading,
	trailing,
	className,
}: {
	leading?: ReactNode;
	trailing?: ReactNode;
	className?: string;
}) {
	return (
		<nav
			className={cn(
				"bg-card border-border flex h-12 items-center justify-between gap-3 border-b px-5",
				className,
			)}
		>
			<div className="flex min-w-0 flex-1 items-center gap-2">{leading}</div>
			<div className="flex shrink-0 items-center gap-2">{trailing}</div>
		</nav>
	);
}
