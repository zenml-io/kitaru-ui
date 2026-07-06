import type { ReactNode } from "react";
import { cn } from "@zenml/hashi/lib/utils";

interface PageIdentityHeaderProps {
	/** Squared avatar / image on the far left. */
	avatar: ReactNode;
	/** Uppercase eyebrow rendered above the title — short labels work best. */
	pretitle?: ReactNode;
	/** The page name. Rendered as an h1. */
	title: string;
	/** Optional inline metadata sitting next to the title — tags, status,
	 *  member counts, etc. Wrapped in a flex row that wraps on overflow. */
	meta?: ReactNode;
	/** Right-aligned cluster — stats, action buttons, member stack + ⋮ menu,
	 *  etc. A flex column so callers can stack multiple rows. */
	actions?: ReactNode;
	className?: string;
}

/**
 * Shared page-level identity header for org / workspace / project pages.
 * Matches Paper artboards 4E6-0 (org), 5IE-0 family (workspace), and 4U8-0
 * (project). Each consumer fills the slots with its own content; the header
 * itself owns the container, alignment, padding, and bottom border so the
 * three pages feel visually consistent.
 *
 * Distinct from `IdentityBand` in `identity-band.tsx`, which is a tighter
 * `bg-secondary` wrapper used by flow / deployment detail pages.
 */
export function PageIdentityHeader({
	avatar,
	pretitle,
	title,
	meta,
	actions,
	className,
}: PageIdentityHeaderProps) {
	return (
		<div className={cn("bg-card z-10", className)}>
			<div className="container mx-auto flex w-full flex-wrap items-center gap-4 px-8 py-4">
				<div className="flex min-w-0 items-center gap-3">
					{avatar}
					<div className="flex min-w-0 flex-col items-start gap-0.5">
						{pretitle ? (
							<span className="text-muted-foreground text-2xs font-semibold tracking-[0.5px] uppercase">
								{pretitle}
							</span>
						) : null}
						<div className="flex flex-wrap items-center gap-3">
							<h1 className="text-foreground line-clamp-1 text-lg font-semibold">
								{title}
							</h1>
							{meta}
						</div>
					</div>
				</div>
				{actions ? (
					<div className="ml-auto flex flex-col items-end gap-2">{actions}</div>
				) : null}
			</div>
		</div>
	);
}
