import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/settings/profile")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: buildPageTitles("Profile") }],
	}),
});

function RouteComponent() {
	return <div>Hello "/_private/_navbar/settings/profile"!</div>;
}
