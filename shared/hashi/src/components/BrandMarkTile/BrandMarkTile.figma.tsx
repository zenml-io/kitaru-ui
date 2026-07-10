import figma from "@figma/code-connect";

import { BrandMarkTile } from "./BrandMarkTile";

figma.connect(
	BrandMarkTile,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=244-11",
	{
		props: {
			brand: figma.enum("brand", {
				zenml: "zenml",
				kitaru: "kitaru",
			}),
		},
		example: ({ brand }) => <BrandMarkTile brand={brand} />,
	}
);
