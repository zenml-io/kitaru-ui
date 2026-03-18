import { userQueries } from "@/modules/users/business-logic/user-queries";
import { MembersListPageContainer } from "@/modules/users/feature/MembersListPageContainer";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/settings/members")({
	component: MembersListPageContainer,
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(userQueries.list()),
			context.queryClient.ensureQueryData(userQueries.currentUser()),
		]);

		return {
			crumb: {
				label: "Members",
				disabled: false,
			},
		};
	},
	head: () => ({
		meta: [{ title: buildPageTitles("Members") }],
	}),
});
