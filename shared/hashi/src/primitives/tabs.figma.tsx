import figma from "@figma/code-connect";

import { Tabs, TabsList, TabsTrigger } from "./tabs";

figma.connect(
	TabsList,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=81-22",
	{
		props: {
			variant: figma.enum("variant", { line: "line" }),
			tab1: figma.string("Tab 1"),
			tab2: figma.string("Tab 2"),
			tab3: figma.string("Tab 3"),
		},
		example: ({ variant, tab1, tab2, tab3 }) => (
			<Tabs defaultValue="tab-1">
				<TabsList variant={variant}>
					<TabsTrigger value="tab-1">{tab1}</TabsTrigger>
					<TabsTrigger value="tab-2">{tab2}</TabsTrigger>
					<TabsTrigger value="tab-3">{tab3}</TabsTrigger>
				</TabsList>
			</Tabs>
		),
	}
);
