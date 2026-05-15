import KitaruLogo from "@/assets/icons/kitaru-logo.svg?react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Link, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { BreadcrumbsContainer } from "../feature/BreadcrumbsContainer";
import { UserDropdownContainer } from "../feature/UserDropdownContainer";
import { NavbarTabs, type NavbarTab } from "./NavbarTabs";

const NAVBAR_TABS: NavbarTab[] = [
	{ to: "/flows", label: "Flows" },
	{ to: "/executions", label: "Executions" },
];

export function NavbarLayout() {
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="z-20 shrink-0">
				<header className="bg-card border-border flex h-12 items-center justify-between gap-3 border-b px-5">
					<div className="flex min-w-0 flex-1 items-center gap-2.5">
						<Link to="/flows" className="flex items-center gap-2 no-underline">
							<KitaruLogo className="h-4 w-auto" />
						</Link>
						<div className="bg-border mx-0.5 h-[3px] w-[3px] shrink-0 rounded-full" />
						<BreadcrumbsContainer />
					</div>
					<div className="flex shrink-0 items-center gap-2">
						<NavbarTabs tabs={NAVBAR_TABS} />
						<Suspense fallback={<Skeleton className="h-7 w-7 rounded-full" />}>
							<UserDropdownContainer />
						</Suspense>
					</div>
				</header>
			</div>
			<div className="flex flex-1 flex-col overflow-y-auto">
				<Outlet />
			</div>
		</div>
	);
}
