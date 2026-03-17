import { userQueries } from "@/modules/users/business-logic/user-queries";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/settings/members")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(userQueries.list()),
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

function RouteComponent() {
	return <div>Hello "/_private/_navbar/settings/members"!</div>;
}
