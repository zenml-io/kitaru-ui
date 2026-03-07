import { MeshGradientBg } from "@/shared/layouts/ui/mesh-layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/_mesh")({
	component: RouteComponent,
});

function RouteComponent() {
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
