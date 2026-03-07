import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/")({
	component: Index,
	head() {
		return {
			meta: [{ title: buildPageTitles("Home") }],
		};
	},
});

function Index() {
	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
		</div>
	);
}
