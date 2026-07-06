import { DeploymentHeaderContainer } from "@zenml/shared-kitaru/modules/deployments";
import { FlowContextBarContainer } from "@zenml/shared-kitaru/modules/flows";
import {
	createFileRoute,
	getRouteApi,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import { useCallback } from "react";
import {
	FlowDetailRouteProvider,
	type FlowTab,
} from "@zenml/shared-kitaru/modules/flows";
import type {
	DeploymentVersion,
	VersionExecutionsLinkProps,
} from "@zenml/shared-kitaru/modules/deployments";

const tabRouteApi = getRouteApi(
	"/_private/_navbar/flows/$flowId/v/$version/_tabs/$tab"
);

export const Route = createFileRoute(
	"/_private/_navbar/flows/$flowId/v/$version/_tabs"
)({
	component: FlowDetailRouteAdapter,
});

function LinkToVersionExecutions({
	flowId,
	version,
	className,
	children,
}: VersionExecutionsLinkProps) {
	return (
		<Link
			to="/flows/$flowId/v/$version/$tab"
			params={{ flowId, version, tab: "executions" }}
			className={className}
		>
			{children}
		</Link>
	);
}

function FlowDetailRouteAdapter() {
	const { flowId, version, tab } = tabRouteApi.useParams();
	const navigate = useNavigate();

	const goToTab = useCallback(
		(next: FlowTab) => {
			navigate({
				to: "/flows/$flowId/v/$version/$tab",
				params: { flowId, version, tab: next },
			});
		},
		[navigate, flowId, version]
	);

	const redirectToExecution = useCallback(
		(target: {
			flowId: string;
			version: DeploymentVersion;
			executionId: string;
		}) => {
			void navigate({
				to: "/flows/$flowId/v/$version/executions/$executionId",
				params: target,
			});
		},
		[navigate]
	);

	return (
		<FlowDetailRouteProvider
			state={{ flowId, version, tab }}
			navigation={{ goToTab, redirectToExecution, LinkToVersionExecutions }}
		>
			<DeploymentHeaderContainer />
			<FlowContextBarContainer />
			<Outlet />
		</FlowDetailRouteProvider>
	);
}
