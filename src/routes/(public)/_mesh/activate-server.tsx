import { serverInfoQueryOptions } from "@/features/app/domain/queries/server-info-query";
import { ServerActivationForm } from "@/features/server-activation/feature/server-activation-form-container";
import { Card, CardContent } from "@/shared/ui/card";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/_mesh/activate-server")({
	beforeLoad: async ({ context }) => {
		const serverInfo = await context.queryClient.ensureQueryData(
			serverInfoQueryOptions()
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
				<ServerActivationForm />
			</CardContent>
		</Card>
	);
}
