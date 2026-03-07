import { MeshLayout } from "@/features/app/layouts/mesh-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/_mesh")({
	component: MeshLayout,
});
