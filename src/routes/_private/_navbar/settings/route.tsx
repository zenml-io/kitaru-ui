import { SettingsLayoutContainer } from "@/modules/settings/features/SettingsLayoutContainer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_navbar/settings")({
	component: SettingsLayoutContainer,
	loader: () => {
		return {
			crumb: {
				label: "Settings",
				disabled: false,
			},
		};
	},
});
