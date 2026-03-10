import "@/assets/styles/tailwind.css";
import { RootProviders } from "@/modules/root/feature/RootProviders";
import { queryClient } from "@/modules/root/query-client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { DefaultErrorPage } from "./modules/root/ui/DefaultError";
import { DefaultPageNotFound } from "./modules/root/ui/DefaultPageNotFound";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
	routeTree,
	context: { queryClient },
	defaultPreload: "intent",
	// Since we're using React Query, we don't want loader calls to ever be stale
	// This will ensure that the loader is always called when the route is preloaded or visited
	defaultPreloadStaleTime: 0,
	scrollRestoration: true,
	defaultNotFoundComponent: DefaultPageNotFound,
	defaultErrorComponent: DefaultErrorPage,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<RootProviders>
				<RouterProvider router={router} />
			</RootProviders>
		</StrictMode>
	);
}
