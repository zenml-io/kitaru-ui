import figma from "@figma/code-connect";

import { Skeleton } from "./skeleton";

figma.connect(
	Skeleton,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=73-5",
	{
		// Size and shape come from className in code; the Figma component is a
		// resizable 200×16 reference shape.
		example: () => <Skeleton className="h-4 w-50" />,
	}
);
