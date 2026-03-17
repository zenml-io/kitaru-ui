import { Outlet } from "@tanstack/react-router";
import { SettingsNavigation } from "../ui/SettingsNavigation";

export function SettingsLayoutContainer() {
	return (
		<div className="container mx-auto flex h-full flex-col gap-4 py-8 lg:flex-row">
			<SettingsNavigation />
			<main className="w-full">
				<Outlet />
			</main>
		</div>
	);
}
