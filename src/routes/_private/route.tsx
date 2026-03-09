import { currentUserQueries } from "@/modules/root/business-logic/current-user-queries";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
	component: PrivateLayout,
	beforeLoad: async ({ context }) => {
		await context.queryClient.ensureQueryData(currentUserQueries.detail());
	},
});

function PrivateLayout() {
	return <Outlet />;
}
