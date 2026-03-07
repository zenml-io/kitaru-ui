import { serverInfoQueryOptions } from "@/features/app/domain/queries/server-info-query";
import { Toaster } from "@/shared/ui/sonner";
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
		<div className="font-medium antialiased">
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
				serverInfoQueryOptions()
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
