import { userQueries } from "@/modules/users/business-logic/user-queries";
import { NavbarLayout } from "@/modules/root/ui/NavbarLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar")({
	loader: async ({ context }) => {
		return Promise.all([
			context.queryClient.ensureQueryData(userQueries.currentUser()),
		]);
	},
	component: NavbarLayout,
});
