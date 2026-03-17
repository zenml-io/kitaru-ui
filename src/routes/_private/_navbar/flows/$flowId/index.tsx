import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/flows/$flowId/")({
	beforeLoad: ({ params: { flowId } }) => {
		throw redirect({
			to: "/flows/$flowId/$tab",
			params: { flowId: flowId, tab: "overview" },
		});
	},
});
