import figma from "@figma/code-connect";
import { ArrowLeft, Bell, Plus } from "lucide-react";

import { Avatar, AvatarFallback } from "../../primitives/avatar/avatar";
import { IconButton } from "../../primitives/icon-button/icon-button";
import { Button } from "@zenml/hashi/primitives/button";

import { AppNavbar } from "./AppNavbar";
import { BrandMarkTile } from "../BrandMarkTile/BrandMarkTile";
import { NavbarBrandSlot } from "../NavbarBrandSlot/NavbarBrandSlot";

figma.connect(
	AppNavbar,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=301-915",
	{
		props: {
			leading: figma.enum("leading", {
				brand: (
					<NavbarBrandSlot>
						<BrandMarkTile brand="zenml" />
					</NavbarBrandSlot>
				),
				breadcrumbs: (
					<span className="contents">
						<NavbarBrandSlot>
							<BrandMarkTile brand="kitaru" />
						</NavbarBrandSlot>
						<IconButton
							icon={<ArrowLeft className="size-4" />}
							label="Go back"
							variant="ghost"
							size="icon-sm"
						/>
						<span className="truncate text-sm">
							<span className="text-foreground font-medium">
								zenml-eu-central
							</span>
							<span className="text-muted-foreground">
								{" "}
								/ production-traces
							</span>
						</span>
					</span>
				),
			}),
			trailing: figma.enum("trailing", {
				actions: (
					<span className="contents">
						<Button size="sm">
							<Plus className="size-4" /> New run
						</Button>
						<IconButton
							icon={<Bell className="size-4" />}
							label="Notifications"
							variant="ghost"
							size="icon-sm"
						/>
						<Avatar size="sm" aria-label="User avatar">
							<AvatarFallback>AK</AvatarFallback>
						</Avatar>
					</span>
				),
			}),
		},
		example: ({ leading, trailing }) => (
			<AppNavbar leading={leading} trailing={trailing} />
		),
	}
);
