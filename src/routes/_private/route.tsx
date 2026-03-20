import { PageAnalyticsContainer } from "@/modules/analytics/feature/PageAnalyticsContainer";
import { userQueries } from "@/modules/users/business-logic/user-queries";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
	component: PrivateLayout,
	beforeLoad: async ({ context }) => {
		await context.queryClient.ensureQueryData(userQueries.currentUser());
	},
});

function PrivateLayout() {
	return (
		<>
			<PageAnalyticsContainer />
			<Outlet />
		</>
	);
}
