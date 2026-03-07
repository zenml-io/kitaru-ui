import { Toaster } from "@/shared/ui/sonner";
import { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
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
		component: RootLayout,
	}
);
