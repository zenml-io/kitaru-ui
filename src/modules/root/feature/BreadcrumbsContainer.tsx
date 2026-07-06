import { DeploymentVersionSwitcherContainer } from "@zenml/shared-kitaru/modules/deployments";
import {
	Breadcrumbs,
	type BreadcrumbItemData,
} from "@zenml/hashi/components/Breadcrumbs";
import { isMatch, Link, useMatches } from "@tanstack/react-router";

const FLOW_DETAIL_ROUTE_ID = "/_private/_navbar/flows/$flowId";

export function BreadcrumbsContainer() {
	const matches = useMatches();

	if (matches.some((match) => match.status === "pending")) return null;

	const matchesWithCrumbs = matches.filter((match) =>
		isMatch(match, "loaderData.crumb")
	);

	if (matchesWithCrumbs.length <= 1) return null;

	const items: BreadcrumbItemData[] = matchesWithCrumbs.map((match, index) => ({
		key: match.id,
		label: match.loaderData?.crumb.label,
		isCurrent: index === matchesWithCrumbs.length - 1,
		isDisabled: match.loaderData?.crumb.disabled,
		labelRender: <Link to={match.fullPath} search={(prev) => prev} />,
		trailing:
			match.routeId === FLOW_DETAIL_ROUTE_ID ? (
				<DeploymentVersionSwitcherContainer />
			) : undefined,
	}));

	return <Breadcrumbs items={items} />;
}
