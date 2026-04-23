import { DeploymentVersionSwitcherContainer } from "@/modules/deployments/feature/DeploymentVersionSwitcherContainer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";
import { isMatch, Link, useMatches } from "@tanstack/react-router";
import { Fragment } from "react";

const FLOW_DETAIL_ROUTE_ID = "/_private/_navbar/flows/$flowId";

export function BreadcrumbsContainer() {
	const matches = useMatches();

	if (matches.some((match) => match.status === "pending")) return null;

	const matchesWithCrumbs = matches.filter((match) =>
		isMatch(match, "loaderData.crumb")
	);

	if (matchesWithCrumbs.length <= 1) return null;

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{matchesWithCrumbs.map((match, index) => (
					<Fragment key={match.id}>
						<BreadcrumbItem>
							{index === matchesWithCrumbs.length - 1 ? (
								<BreadcrumbPage className="font-semibold">
									{match.loaderData?.crumb.label}
								</BreadcrumbPage>
							) : match.loaderData?.crumb.disabled ? (
								<BreadcrumbPage>{match.loaderData?.crumb.label}</BreadcrumbPage>
							) : (
								<BreadcrumbLink
									render={<Link to={match.fullPath} search={(prev) => prev} />}
								>
									{match.loaderData?.crumb.label}
								</BreadcrumbLink>
							)}
							{match.routeId === FLOW_DETAIL_ROUTE_ID && (
								<DeploymentVersionSwitcherContainer />
							)}
						</BreadcrumbItem>
						{index < matchesWithCrumbs.length - 1 ? (
							<BreadcrumbSeparator />
						) : null}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
