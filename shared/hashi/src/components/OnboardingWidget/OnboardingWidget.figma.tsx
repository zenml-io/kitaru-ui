import figma from "@figma/code-connect";

import {
	OnboardingWidgetCard,
	OnboardingWidgetPill,
	OnboardingWidgetStepRow,
} from "./OnboardingWidget";

figma.connect(
	OnboardingWidgetStepRow,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=315-1270",
	{
		props: {
			state: figma.enum("state", {
				done: "done",
				current: "current",
				skipped: "skipped",
				upcoming: "upcoming",
			}),
		},
		example: ({ state }) => (
			<OnboardingWidgetStepRow
				id="device_verified"
				label="Get set up locally"
				state={state}
				onSelect={() => {}}
			/>
		),
	}
);

figma.connect(
	OnboardingWidgetCard,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=315-1271",
	{
		variant: { actions: "true" },
		props: {
			itemsDone: figma.enum("progress", {
				fresh: 1,
				mid: 3,
				complete: 5,
			}),
		},
		example: ({ itemsDone }) => (
			<OnboardingWidgetCard
				title="Finish setting up"
				items={[
					{
						id: "workspace_created",
						label: "Create your Kitaru workspace",
						state: "done",
					},
					{
						id: "device_verified",
						label: "Get set up locally",
						state: "current",
					},
				]}
				itemsDone={itemsDone}
				totalItems={5}
				onSelectStep={() => {}}
				onResume={() => {}}
				onDismiss={() => {}}
				onCollapse={() => {}}
			/>
		),
	}
);

figma.connect(
	OnboardingWidgetCard,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=315-1271",
	{
		variant: { actions: "false" },
		props: {
			itemsDone: figma.enum("progress", {
				fresh: 1,
				mid: 3,
				complete: 5,
			}),
		},
		example: ({ itemsDone }) => (
			<OnboardingWidgetCard
				title="Finish setting up"
				items={[
					{
						id: "workspace_created",
						label: "Create your Kitaru workspace",
						state: "done",
					},
					{
						id: "device_verified",
						label: "Get set up locally",
						state: "current",
					},
				]}
				itemsDone={itemsDone}
				totalItems={5}
			/>
		),
	}
);

figma.connect(
	OnboardingWidgetPill,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=315-1262",
	{
		example: () => (
			<OnboardingWidgetPill
				title="Finish setting up"
				itemsDone={3}
				totalItems={5}
				onExpand={() => {}}
			/>
		),
	}
);
