import { Outlet } from "@tanstack/react-router";
import { SettingsNavigation } from "../ui/settings-navigation";

export function SettingsLayoutContainer() {
	return (
		<div className="container mx-auto flex h-full flex-col gap-4 py-2 lg:flex-row">
			<SettingsNavigation />
			<Outlet />
		</div>
	);
}
