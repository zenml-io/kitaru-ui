import "@/assets/styles/tailwind.css";
// Configure the Monaco editor workers once at boot. The shared
// MonacoJsonSchemaEditor reads the worker setup from self.MonacoEnvironment at
// runtime; the worker imports are Vite-specific so they stay in the host app.
import "@/modules/executions/feature/setup-monaco";
import { RootProviders } from "@/modules/root/feature/RootProviders";
import { queryClient } from "@/modules/root/query-client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { DefaultErrorPage } from "./modules/root/ui/DefaultError";
import { DefaultPageNotFound } from "./modules/root/ui/DefaultPageNotFound";
import { apiClient } from "./shared/api/domain/api-client";
import { KITARU_SCOPE_KEY } from "./shared/api/domain/kitaru-scope";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		queryClient,
		kitaruApiClient: apiClient,
		scopeKey: KITARU_SCOPE_KEY,
	},
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
