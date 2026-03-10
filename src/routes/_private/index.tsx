import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/")({
	beforeLoad: () => {
		throw redirect({ to: "/flows" });
	},
});
