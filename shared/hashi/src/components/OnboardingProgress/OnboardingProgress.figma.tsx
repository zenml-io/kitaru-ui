import figma from "@figma/code-connect";

import {
	OnboardingProgressBar,
	OnboardingProgressRing,
} from "./OnboardingProgress";

figma.connect(
	OnboardingProgressBar,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=305-929",
	{
		variant: { type: "bar" },
		props: {
			value: figma.enum("value", {
				"0%": 0,
				"50%": 50,
				"100%": 100,
			}),
		},
		example: ({ value }) => (
			<OnboardingProgressBar value={value} label="Onboarding progress" />
		),
	}
);

figma.connect(
	OnboardingProgressRing,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=305-929",
	{
		variant: { type: "ring" },
		props: {
			value: figma.enum("value", {
				"0%": 0,
				"50%": 50,
				"100%": 100,
			}),
			size: figma.enum("size", {
				sm: 24,
				md: 32,
				lg: 48,
			}),
		},
		example: ({ value, size }) => (
			<OnboardingProgressRing value={value} size={size} />
		),
	}
);
