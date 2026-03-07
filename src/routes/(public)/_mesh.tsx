import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/_mesh")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="relative flex min-h-dvh items-center justify-center">
			{/* <MeshGradientBg variant={step === "success" ? "success" : "default"} /> */}
			<div className="bg-red-600"></div>
			<div className="flex flex-col items-center gap-6">
				<p className="text-foreground text-2xl font-bold">Kitaru</p>
				<Outlet />
			</div>
		</div>
	);
}
