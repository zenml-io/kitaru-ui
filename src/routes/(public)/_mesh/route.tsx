import { MeshLayout } from "@/modules/root/ui/MeshLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/_mesh")({
	component: MeshLayout,
});
