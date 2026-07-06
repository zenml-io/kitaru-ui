import type { Meta, StoryObj } from "@storybook/react-vite";

import { OrgMark } from "./OrgMark";

const meta: Meta<typeof OrgMark> = {
	title: "Components/OrgMark",
	component: OrgMark,
	args: {
		name: "Acme Corp",
		imageSrc: "https://github.com/zenml-io.png",
		size: "sm",
	},
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "xl"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof OrgMark>;

export const Default: Story = {};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-end gap-6">
			<div className="flex flex-col items-center gap-2">
				<OrgMark
					name="ZenML"
					imageSrc="https://github.com/zenml-io.png"
					size="sm"
				/>
				<span className="text-muted-foreground text-xs">sm (default)</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<OrgMark
					name="ZenML"
					imageSrc="https://github.com/zenml-io.png"
					size="xl"
				/>
				<span className="text-muted-foreground text-xs">xl</span>
			</div>
		</div>
	),
};

// When the image fails to load the avatar shows a branded fallback (bg-primary,
// no initials — per the "imageless tints" convention).
export const FallbackState: Story = {
	name: "Fallback (image error)",
	render: () => (
		<div className="flex items-end gap-6">
			<div className="flex flex-col items-center gap-2">
				<OrgMark name="Acme Corp" imageSrc="/does-not-exist.png" size="sm" />
				<span className="text-muted-foreground text-xs">sm — no image</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<OrgMark name="Acme Corp" imageSrc="/does-not-exist.png" size="xl" />
				<span className="text-muted-foreground text-xs">xl — no image</span>
			</div>
		</div>
	),
};

// A realistic navbar breadcrumb slot showing the org mark next to a slash
// separator and a workspace name — matches the three-identity navbar pattern.
export const InNavbarBreadcrumb: Story = {
	render: () => (
		<div className="bg-card border-border flex h-12 w-96 items-center gap-2 rounded-md border px-4">
			<OrgMark
				name="ZenML"
				imageSrc="https://github.com/zenml-io.png"
				size="sm"
			/>
			<span className="text-muted-foreground">/</span>
			<span className="text-sm font-medium">production-eu-central</span>
		</div>
	),
};
