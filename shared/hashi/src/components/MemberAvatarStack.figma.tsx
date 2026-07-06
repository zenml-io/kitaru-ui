import figma from "@figma/code-connect";

import { MemberAvatarStack } from "./MemberAvatarStack";

figma.connect(
	MemberAvatarStack,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=91-5",
	{
		// Avatars and the +N chip are data-driven; the Figma "Overflow count"
		// text prop has no code equivalent and is omitted.
		example: () => (
			<MemberAvatarStack
				members={[
					{
						id: "1",
						name: "Zuri Negrín",
						email: "zuri@zenml.io",
						initials: "ZN",
						tintIndex: 0,
					},
				]}
			/>
		),
	}
);
