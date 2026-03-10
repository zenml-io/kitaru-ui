import KitaruLogo from "@/assets/icons/kitaru-logo.svg?react";
import { Link, Outlet } from "@tanstack/react-router";
import { BreadcrumbsContainer } from "../feature/BreadcrumbsContainer";
import { UserDropdownContainer } from "../feature/UserDropdownContainer";

export function NavbarLayout() {
	return (
		<div>
			<div className="z-20 shrink-0">
				<nav className="bg-card border-border flex h-12 items-center justify-between border-b px-5">
					<div className="flex items-center gap-2.5">
						<Link to="/flows" className="flex items-center gap-2 no-underline">
							<KitaruLogo className="h-4 w-auto" />
						</Link>
						<div className="bg-border mx-0.5 h-[3px] w-[3px] rounded-full" />
						<BreadcrumbsContainer />
					</div>
					<div className="flex items-center gap-1">
						<UserDropdownContainer />
					</div>
				</nav>
			</div>
			<Outlet />
		</div>
	);
}
