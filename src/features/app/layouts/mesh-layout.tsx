import { Outlet } from "@tanstack/react-router";
import { MeshGradientBg } from "./mesh-gradient-bg";

export function MeshLayout() {
	return (
		<div className="relative flex min-h-dvh items-center justify-center">
			<MeshGradientBg />
			<div className="flex w-full flex-col items-center gap-6 px-4">
				<p className="text-foreground text-2xl font-bold">Kitaru</p>
				<Outlet />
			</div>
		</div>
	);
}
