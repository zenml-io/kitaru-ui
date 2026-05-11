import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/"
)({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/flows/$flowId/v/$version/executions",
			params: { ...params },
		});
	},
});
