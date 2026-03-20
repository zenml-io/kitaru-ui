import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/settings/")({
	beforeLoad: () => {
		throw redirect({ to: "/settings/profile" });
	},
});
