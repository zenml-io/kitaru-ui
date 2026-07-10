import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@zenml/hashi/primitives/input";
import { cn } from "@zenml/hashi/lib/utils";
import type { ReactNode } from "react";

// Shared dropdown shell for breadcrumb switcher pills.
export function SwitcherDropdownMenu({
	contextLabel,
	searchPlaceholder,
	searchAriaLabel,
	headerExtras,
	footer,
	className,
	listClassName,
	children,
}: {
	contextLabel: string;
	searchPlaceholder?: string;
	searchAriaLabel?: string;
	headerExtras?: ReactNode;
	/** Footer slot. Accepts a function to read the live search query (e.g.
	 *  for "Showing 3 of 12" counters that change as the user types). */
	footer?: ReactNode | ((args: { query: string }) => ReactNode);
	className?: string;
	listClassName?: string;
	children: (args: { query: string }) => ReactNode;
}) {
	const [query, setQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const id = window.setTimeout(() => inputRef.current?.focus(), 30);
		return () => window.clearTimeout(id);
	}, []);

	const placeholder =
		searchPlaceholder ?? `Search ${contextLabel.toLowerCase()}…`;
	const ariaLabel = searchAriaLabel ?? `Search ${contextLabel.toLowerCase()}`;

	return (
		<div className={cn("flex flex-col", className)}>
			<div className="border-border border-b">
				<div className="text-2xs text-muted-foreground px-3 pt-2 pb-1 font-semibold tracking-wider uppercase">
					{contextLabel}
				</div>
				<div className="flex items-center gap-2 px-2 pt-1 pb-2">
					<div className="relative min-w-0 flex-1">
						<Search
							className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
							aria-hidden
						/>
						<Input
							ref={inputRef}
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={(e) => e.stopPropagation()}
							placeholder={placeholder}
							className="h-8 pr-2 pl-8 text-xs"
							aria-label={ariaLabel}
						/>
					</div>
					{headerExtras}
				</div>
			</div>
			<div className={cn("max-h-[420px] overflow-y-auto p-1", listClassName)}>
				{children({ query })}
			</div>
			{footer && (
				<div className="border-border border-t">
					{typeof footer === "function" ? footer({ query }) : footer}
				</div>
			)}
		</div>
	);
}
