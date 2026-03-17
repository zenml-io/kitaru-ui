import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/flows")({
	component: Outlet,
	loader: () => {
		return {
			crumb: {
				label: "Flows",
				disabled: false,
			},
		};
	},
});
