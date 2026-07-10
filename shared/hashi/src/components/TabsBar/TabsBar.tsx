import type { ReactElement, ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@zenml/hashi/primitives/tabs";
import { cn } from "@zenml/hashi/lib/utils";

export interface TabsBarItem {
	value: string;
	label: string;
	badge?: string | number;
	/** Render the trigger as another element (e.g. a NavLink). Skip for
	 *  controlled tabs that drive a parent's useState. */
	render?: ReactElement;
}

interface TabsBarProps {
	tabs: TabsBarItem[];
	activeTab?: string;
	onTabChange?: (value: string) => void;
	actions?: ReactNode;
	sticky?: boolean;
	/**
	 * `"page"` — layout-chrome tabs centered to `max-w-page` (`bg-card`, `px-8`).
	 * Used by org / workspace / project layouts via `NavTabsBar`.
	 *
	 * `"panel"` — tab surface scoped to a content panel (`bg-secondary`, `px-4`).
	 * Used inside flow / execution / deployment detail panels.
	 */
	surface?: "page" | "panel";
	className?: string;
}

// Single shared tab-bar shell. Consumed directly by detail pages
// (controlled, with badge support) and by `NavTabsBar` (URL-driven
// NavLink triggers). The Tabs + TabsList + TabsTrigger styling lives
// here so both surfaces stay in sync.
export function TabsBar({
	tabs,
	activeTab,
	onTabChange,
	actions,
	sticky = true,
	surface = "page",
	className,
}: TabsBarProps) {
	const triggers = (
		<>
			<Tabs
				value={activeTab}
				onValueChange={onTabChange}
				className="-mx-1 h-full min-w-0 overflow-x-auto px-1"
			>
				<TabsList
					variant="line"
					className="min-w-max p-0 group-data-[orientation=horizontal]/tabs:h-full"
				>
					{tabs.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							render={tab.render}
							nativeButton={tab.render ? false : undefined}
							className="h-full px-3 text-sm group-data-[orientation=horizontal]/tabs:after:-bottom-px"
						>
							<span className="inline-flex items-center gap-1.5">
								{tab.label}
								{tab.badge !== undefined && (
									<span
										className={cn(
											"text-2xs inline-flex items-center justify-center rounded px-1 font-mono",
											"bg-muted text-muted-foreground min-w-[18px] tabular-nums"
										)}
									>
										{tab.badge}
									</span>
								)}
							</span>
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
			{actions && (
				<div className="flex shrink-0 items-center gap-1.5 self-center">
					{actions}
				</div>
			)}
		</>
	);

	if (surface === "page") {
		return (
			<div
				className={cn(
					"bg-card border-border z-10 h-12 border-b",
					sticky && "sticky top-0",
					className
				)}
			>
				<div className="container mx-auto flex h-full w-full items-stretch justify-between gap-3 px-8">
					{triggers}
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"bg-secondary border-border z-10 h-12 border-b",
				"flex items-stretch justify-between gap-3 px-4",
				sticky && "sticky top-0",
				className
			)}
		>
			{triggers}
		</div>
	);
}
