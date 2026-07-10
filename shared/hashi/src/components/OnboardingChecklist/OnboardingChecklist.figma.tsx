import figma from "@figma/code-connect";

import {
	OnboardingChecklist,
	OnboardingChecklistItem,
} from "./OnboardingChecklist";

figma.connect(
	OnboardingChecklistItem,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=309-945",
	{
		props: {
			isCompleted: figma.enum("state", {
				completed: true,
				current: false,
				skipped: false,
				upcoming: false,
			}),
			isActive: figma.enum("state", {
				completed: false,
				current: true,
				skipped: false,
				upcoming: false,
			}),
			hasDownstreamStep: figma.enum("state", {
				completed: false,
				current: false,
				skipped: true,
				upcoming: false,
			}),
			children: figma.boolean("body", {
				true: (
					<p className="text-muted-foreground text-sm">
						Kitaru projects organize your ML work. Use them to separate
						initiatives, teams, or experiments.
					</p>
				),
				false: undefined,
			}),
		},
		example: ({ isCompleted, isActive, hasDownstreamStep, children }) => (
			<OnboardingChecklistItem
				index={2}
				title="Create a new project"
				isCompleted={isCompleted}
				isActive={isActive}
				hasDownstreamStep={hasDownstreamStep}
			>
				{children}
			</OnboardingChecklistItem>
		),
	}
);

figma.connect(
	OnboardingChecklist,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=312-1049",
	{
		props: {
			itemsDone: figma.enum("progress", {
				fresh: 1,
				mid: 3,
				complete: 5,
			}),
		},
		example: ({ itemsDone }) => (
			<OnboardingChecklist
				title="Get your first flow running"
				subtitle="A few steps to a reproducible flow on a managed stack."
				itemsDone={itemsDone}
				totalItems={5}
			>
				<OnboardingChecklistItem
					index={1}
					title="Create your Kitaru workspace"
					isCompleted
					isActive={false}
					hasDownstreamStep={false}
				/>
				<OnboardingChecklistItem
					index={2}
					title="Create a new project"
					isCompleted={false}
					isActive
					hasDownstreamStep={false}
				>
					<p className="text-muted-foreground text-sm">
						Kitaru projects organize your ML work.
					</p>
				</OnboardingChecklistItem>
			</OnboardingChecklist>
		),
	}
);
