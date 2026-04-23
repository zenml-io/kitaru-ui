import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/settings/secrets")({
	component: Outlet,
	loader: () => ({
		crumb: { label: "Secrets", disabled: false },
	}),
});
