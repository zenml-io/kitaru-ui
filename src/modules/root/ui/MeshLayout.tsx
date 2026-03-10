import { Outlet } from "@tanstack/react-router";
import { MeshLayoutFrame } from "./MeshLayoutFrame";

export function MeshLayout() {
	return (
		<MeshLayoutFrame>
			<Outlet />
		</MeshLayoutFrame>
	);
}
