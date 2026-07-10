import figma from "@figma/code-connect";

import { BrandMarkTile } from "../BrandMarkTile/BrandMarkTile";
import { NavbarBrandSlot } from "./NavbarBrandSlot";

// The Figma brand variant drives the hosted BrandMarkTile child; the render
// prop (div vs link) is behavioral only and has no Figma representation.
figma.connect(
	NavbarBrandSlot,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=244-437",
	{
		props: {
			brand: figma.enum("brand", {
				zenml: "zenml",
				kitaru: "kitaru",
			}),
		},
		example: ({ brand }) => (
			<NavbarBrandSlot>
				<BrandMarkTile brand={brand} />
			</NavbarBrandSlot>
		),
	}
);
