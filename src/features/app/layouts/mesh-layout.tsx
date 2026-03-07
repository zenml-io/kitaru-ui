import KitaruLogo from "@/assets/icons/kitaru-logo.svg?react";
import { Outlet } from "@tanstack/react-router";
import { MeshGradientBg } from "./mesh-gradient-bg";

export function MeshLayout() {
	return (
		<div className="relative flex min-h-dvh items-center justify-center">
			<MeshGradientBg />
			<div className="flex w-full flex-col items-center gap-6 px-4">
				<KitaruLogo className="h-5 w-auto" />
				<Outlet />
			</div>
		</div>
	);
}
