import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/shared/ui/breadcrumb";
import { isMatch, useMatches } from "@tanstack/react-router";

export function NavbarBreadcrumbs() {
	const matches = useMatches();

	if (matches.some((match) => match.status === "pending")) return null;

	const matchesWithCrumbs = matches.filter((match) =>
		isMatch(match, "loaderData.crumb")
	);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{matchesWithCrumbs.map((match, index) => (
					<BreadcrumbItem key={match.id}>
						{index === matchesWithCrumbs.length - 1 ? (
							<BreadcrumbPage>{match.loaderData?.crumb.label}</BreadcrumbPage>
						) : (
							<BreadcrumbLink href={match.loaderData?.crumb.href}>
								{match.loaderData?.crumb.label}
							</BreadcrumbLink>
						)}
					</BreadcrumbItem>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
