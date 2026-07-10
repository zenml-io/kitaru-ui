import figma from "@figma/code-connect";

import { MemberAvatarStack } from "../MemberAvatarStack/MemberAvatarStack";
import { ProjectIdentityBandView } from "./ProjectIdentityBand";

// The context=project variants of the shared PageIdentityHeader set. The
// copied confirmation state lives inside the closed overflow menu, so it has
// no Figma frame; config only tracks the member-stack density.
figma.connect(
	ProjectIdentityBandView,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=288-1091",
	{
		variant: { context: "project" },
		props: {
			name: figma.enum("config", {
				"members-few": "production-traces",
				"members-single": "smoke-test",
				"members-overflow": "feature-store",
			}),
		},
		example: ({ name }) => (
			<ProjectIdentityBandView
				name={name}
				memberAvatars={
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
				}
				copied={false}
				onCopyProjectId={() => {}}
				manageMembersRender={<button type="button" />}
			/>
		),
	}
);
