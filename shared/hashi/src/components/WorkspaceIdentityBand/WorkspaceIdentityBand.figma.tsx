import figma from "@figma/code-connect";

import { MemberAvatarStack } from "../MemberAvatarStack/MemberAvatarStack";
import { WorkspaceIdentityBand } from "./WorkspaceIdentityBand";

// The context=workspace variants of the shared PageIdentityHeader set.
figma.connect(
	WorkspaceIdentityBand,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=288-1091",
	{
		variant: { context: "workspace" },
		props: {
			type: figma.enum("config", {
				"zenml-running": "zenml",
				kitaru: "kitaru",
				degraded: "zenml",
				idle: "zenml",
				"upgrade-available": "zenml",
				"no-external-urls": "zenml",
				"many-members": "zenml",
				"command-copied": "zenml",
			}),
			status: figma.enum("config", {
				"zenml-running": "running",
				kitaru: "running",
				degraded: "degraded",
				idle: "idle",
				"upgrade-available": "running",
				"no-external-urls": "running",
				"many-members": "running",
				"command-copied": "running",
			}),
			upgradeAvailable: figma.enum("config", {
				"upgrade-available": "0.68.1",
			}),
			loginUrl: figma.enum("config", {
				"zenml-running": "https://zenml-eu-central.cloud.zenml.io",
				kitaru: "https://kitaru-us-east.cloud.zenml.io",
				degraded: "https://zenml-eu-central.cloud.zenml.io",
				idle: "https://zenml-eu-central.cloud.zenml.io",
				"upgrade-available": "https://zenml-eu-central.cloud.zenml.io",
				"many-members": "https://zenml-eu-central.cloud.zenml.io",
				"command-copied": "https://zenml-eu-central.cloud.zenml.io",
			}),
			cmdCopied: figma.enum("config", {
				"command-copied": true,
			}),
		},
		example: ({ type, status, upgradeAvailable, loginUrl, cmdCopied }) => (
			<WorkspaceIdentityBand
				workspace={{
					id: "0d95ab1c-3c6e-4a5b-9d1a-2f4e8c7b6a50",
					slug: "zenml-eu-central",
					name: "zenml-eu-central",
					type,
					version: "0.68.1",
					status,
					upgradeAvailable,
					loginUrl,
					apiUrl: loginUrl,
				}}
				memberCount={6}
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
				cmdCopied={cmdCopied}
				uuidCopied={false}
				onCopyCommand={() => {}}
				onCopyUuid={() => {}}
				manageMembersRender={<button type="button" />}
			/>
		),
	}
);
