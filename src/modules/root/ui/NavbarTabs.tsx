import { Link } from "@tanstack/react-router";

export type NavbarTab = {
	to: "/flows" | "/executions";
	label: string;
};

type NavbarTabsProps = {
	tabs: NavbarTab[];
};

export function NavbarTabs({ tabs }: NavbarTabsProps) {
	return (
		<nav className="flex items-center gap-1" aria-label="Primary">
			{tabs.map((tab) => (
				<Link
					key={tab.to}
					to={tab.to}
					className="rounded-md px-3 py-1.5 text-sm font-medium no-underline"
					activeProps={{
						className: "text-foreground",
						"aria-current": "page",
					}}
					inactiveProps={{
						className: "text-muted-foreground hover:text-foreground",
					}}
					activeOptions={{ exact: false }}
				>
					{tab.label}
				</Link>
			))}
		</nav>
	);
}
