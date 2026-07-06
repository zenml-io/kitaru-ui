import { userQueries } from "@/modules/users/business-logic/user-queries";
import { NavbarLayout } from "@/modules/root/ui/NavbarLayout";
import type { DeploymentVersion } from "@zenml/shared-kitaru/modules/deployments";
import {
	NavbarRoutesProvider,
	type NavbarRoutesValue,
} from "@zenml/shared-kitaru/modules/root";
import { createFileRoute, useMatch, useNavigate } from "@tanstack/react-router";

const VERSION_ROUTE_ID = "/_private/_navbar/flows/$flowId/v/$version";

export const Route = createFileRoute("/_private/_navbar")({
	loader: async ({ context }) => {
		return Promise.all([
			context.queryClient.ensureQueryData(userQueries.currentUser(context)),
		]);
	},
	component: NavbarRouteAdapter,
});

/**
 * The version switcher lives in the app-shell breadcrumbs, above `/v/$version`,
 * so the route context it needs is provided here — the closest host route that
 * wraps the navbar shell. The provider is always mounted (so the shell never
 * remounts); its value is `null` unless a `/v/$version` route is matched.
 */
function NavbarRouteAdapter() {
	const versionMatch = useMatch({ from: VERSION_ROUTE_ID, shouldThrow: false });
	const navigate = useNavigate();

	let value: NavbarRoutesValue | null = null;
	if (versionMatch) {
		const { flowId, version } = versionMatch.params;
		value = {
			state: { flowId, version },
			navigation: {
				goToVersion: (next: DeploymentVersion) => {
					void navigate({
						to: "/flows/$flowId/v/$version/$tab",
						params: { flowId, version: next, tab: "executions" },
					});
				},
			},
		};
	}

	return (
		<NavbarRoutesProvider value={value}>
			<NavbarLayout />
		</NavbarRoutesProvider>
	);
}
