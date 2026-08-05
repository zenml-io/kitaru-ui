import { Skeleton } from "@zenml/hashi/primitives/skeleton";
import { AppNavbar } from "@zenml/hashi/components/AppNavbar";
import { NavbarBrandSlot } from "@zenml/hashi/components/NavbarBrandSlot";
import { BrandMarkTile } from "@zenml/hashi/components/BrandMarkTile";
import { Link, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { BreadcrumbsContainer } from "../feature/BreadcrumbsContainer";
import { UserDropdownContainer } from "../feature/UserDropdownContainer";
import { NavbarTabs, type NavbarTab } from "./NavbarTabs";

const NAVBAR_TABS: NavbarTab[] = [
	{ to: "/flows", label: "Agents" },
	{ to: "/executions", label: "Executions" },
];

export function NavbarLayout() {
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="z-20 shrink-0">
				<AppNavbar
					leading={
						<>
							<NavbarBrandSlot
								render={<Link to="/flows" aria-label="Kitaru home" />}
							>
								<BrandMarkTile brand="kitaru" />
							</NavbarBrandSlot>
							<BreadcrumbsContainer />
						</>
					}
					trailing={
						<>
							<NavbarTabs tabs={NAVBAR_TABS} />
							<Suspense
								fallback={<Skeleton className="h-7 w-7 rounded-full" />}
							>
								<UserDropdownContainer />
							</Suspense>
						</>
					}
				/>
			</div>
			<div className="flex flex-1 flex-col overflow-y-auto">
				<Outlet />
			</div>
		</div>
	);
}
