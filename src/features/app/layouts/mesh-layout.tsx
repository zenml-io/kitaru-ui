import { Outlet } from "@tanstack/react-router";
import { MeshLayoutFrame } from "./mesh-layout-frame";

export function MeshLayout() {
	return (
		<MeshLayoutFrame>
			<Outlet />
		</MeshLayoutFrame>
	);
}
