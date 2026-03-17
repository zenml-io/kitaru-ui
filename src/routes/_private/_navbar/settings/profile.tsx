import { userQueries } from "@/modules/users/business-logic/user-queries";
import { UpdateCurrentUserPage } from "@/modules/users/features/UpdateCurrentUserPageContainer";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/settings/profile")({
	component: UpdateCurrentUserPage,
	loader: async ({ context }) => {
		return Promise.all([
			context.queryClient.ensureQueryData(userQueries.currentUser()),
		]);
	},
	head: () => ({
		meta: [{ title: buildPageTitles("Profile") }],
	}),
});
