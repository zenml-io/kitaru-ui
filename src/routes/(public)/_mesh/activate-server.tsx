import { serverInfoQueries } from "@/modules/root/business-logic/server-info-queries";
import { ServerActivationFormContainer } from "@/modules/server-activation/feature/ServerActivationFormContainer";
import { Card, CardContent } from "@/shared/ui/card";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/_mesh/activate-server")({
	beforeLoad: async ({ context }) => {
		const serverInfo = await context.queryClient.ensureQueryData(
			serverInfoQueries.detail()
		);

		if (serverInfo.active === true) {
			throw redirect({ to: "/" });
		}
	},
	component: RouteComponent,
	head() {
		return {
			meta: [{ title: buildPageTitles("Activate") }],
		};
	},
});

function RouteComponent() {
	return (
		<Card className="w-full max-w-[400px] shadow-lg">
			<CardContent className="space-y-3 p-8">
				<h2 className="text-center text-lg font-semibold">Activate server</h2>
				<ServerActivationFormContainer />
			</CardContent>
		</Card>
	);
}
