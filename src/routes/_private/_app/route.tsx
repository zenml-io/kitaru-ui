import { currentUserQueries } from "@/modules/root/business-logic/current-user-queries";
import { NavbarLayout } from "@/modules/root/ui/NavbarLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_app")({
	loader: async ({ context }) => {
		return Promise.all([
			context.queryClient.ensureQueryData(currentUserQueries.detail()),
		]);
	},
	component: NavbarLayout,
});
