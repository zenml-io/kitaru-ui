import { currentUserQueryOptions } from "@/features/app/domain/queries/current-user-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
	beforeLoad: async ({ context }) => {
		await context.queryClient.ensureQueryData(currentUserQueryOptions());
	},
	component: PrivateLayout,
});

function PrivateLayout() {
	return <Outlet />;
}
