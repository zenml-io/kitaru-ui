import { userQueries } from "@/modules/users/business-logic/user-queries";
import { UpdateCurrentUserPageContainer } from "@/modules/users/feature/UpdateCurrentUserPageContainer";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/settings/profile")({
	component: UpdateCurrentUserPageContainer,
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(userQueries.currentUser()),
		]);

		return {
			crumb: {
				label: "Profile",
				disabled: false,
			},
		};
	},
	head: () => ({
		meta: [{ title: buildPageTitles("Profile") }],
	}),
});
