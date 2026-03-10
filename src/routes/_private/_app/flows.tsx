import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_app/flows")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: buildPageTitles("Flows") }],
	}),
	loader: async () => {
		return {
			crumb: {
				label: "Flows",
				href: "/flows",
			},
		};
	},
});

function RouteComponent() {
	return <div>Hello Flows!</div>;
}
