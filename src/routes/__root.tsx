import { serverInfoQueries } from "@/modules/root/business-logic/server-info-queries";
import { Toaster } from "@zenml/hashi/primitives/sonner";
import { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

function RootLayout() {
	return (
		<div className="flex h-dvh flex-col font-medium antialiased">
			<HeadContent />
			<Outlet />
			<Toaster position="top-center" />
			<TanStackRouterDevtools />
		</div>
	);
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		beforeLoad: async ({ context, location, buildLocation }) => {
			const serverInfo = await context.queryClient.ensureQueryData(
				serverInfoQueries.detail()
			);

			if (
				serverInfo.active === false &&
				location.pathname !== buildLocation({ to: "/activate-server" }).pathname
			) {
				throw redirect({ to: "/activate-server" });
			}
		},
		component: RootLayout,
	}
);
