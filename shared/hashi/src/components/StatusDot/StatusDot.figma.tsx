import figma from "@figma/code-connect";

import { StatusDot } from "./StatusDot";

figma.connect(
	StatusDot,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=87-23",
	{
		props: {
			status: figma.enum("status", {
				active: "active",
				completed: "completed",
				running: "running",
				retrying: "retrying",
				waiting: "waiting",
				error: "error",
				failed: "failed",
				initializing: "initializing",
				provisioning: "provisioning",
				resuming: "resuming",
				paused: "paused",
				cached: "cached",
				skipped: "skipped",
				retried: "retried",
				stopped: "stopped",
				stopping: "stopping",
				sleeping: "sleeping",
				cancelled: "cancelled",
			}),
		},
		example: ({ status }) => <StatusDot status={status} />,
	}
);
