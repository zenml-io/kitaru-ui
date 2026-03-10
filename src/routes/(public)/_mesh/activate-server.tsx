import { serverInfoQueries } from "@/modules/root/business-logic/server-info-queries";
import { ServerActivationPage } from "@/modules/server-activation/feature/ServerActivationPage";
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
	component: ServerActivationPage,
	head() {
		return {
			meta: [{ title: buildPageTitles("Activate") }],
		};
	},
});
