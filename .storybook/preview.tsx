import React from "react";
import "../src/assets/styles/tailwind.css";
import { RootProviders } from "../src/modules/root/feature/RootProviders";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [
		(Story) => (
			<RootProviders>
				<Story />
			</RootProviders>
		),
	],
};

export default preview;
