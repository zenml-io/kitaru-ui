import figma from "@figma/code-connect";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "./breadcrumb";

figma.connect(
	Breadcrumb,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=85-5",
	{
		props: {
			crumb1: figma.string("Crumb 1"),
			crumb2: figma.string("Crumb 2"),
			page: figma.string("Current page"),
		},
		example: ({ crumb1, crumb2, page }) => (
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#">{crumb1}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="#">{crumb2}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{page}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		),
	}
);
