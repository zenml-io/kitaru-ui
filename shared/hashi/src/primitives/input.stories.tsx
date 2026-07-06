import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeyRound, Search, Server } from "lucide-react";

import { Input } from "./input";

const meta: Meta<typeof Input> = {
	title: "Primitives/Input",
	component: Input,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=66-11",
		},
	},
	args: {
		placeholder: "Placeholder text",
		disabled: false,
	},
	argTypes: {
		type: {
			control: "select",
			options: ["text", "email", "password", "url", "number", "search", "file"],
		},
		disabled: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Types: Story = {
	render: () => (
		<div className="flex max-w-sm flex-col gap-4">
			<Input type="text" placeholder="Pipeline name" />
			<Input type="email" placeholder="zuri@zenml.io" />
			<Input type="password" placeholder="Password" />
			<Input type="url" placeholder="https://zenml.io" />
			<Input type="number" placeholder="0" />
			<Input type="search" placeholder="Search runs..." />
		</div>
	),
};

export const States: Story = {
	render: () => (
		<div className="flex max-w-sm flex-col gap-4">
			<Input placeholder="Idle — no value" />
			<Input aria-label="Idle field" defaultValue="zenml-eu-central" />
			<Input disabled placeholder="Disabled field" />
			<Input
				aria-label="Read-only field"
				disabled
				defaultValue="read-only-value"
			/>
			<Input
				aria-label="Invalid field"
				aria-invalid="true"
				defaultValue="bad-config-value"
			/>
		</div>
	),
};

export const WithLeadingIcon: Story = {
	render: () => (
		<div className="flex max-w-sm flex-col gap-4">
			<div className="relative">
				<Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
				<Input placeholder="Search pipelines..." className="pl-9" />
			</div>
			<div className="relative">
				<Server className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
				<Input placeholder="Stack name" className="pl-9" />
			</div>
			<div className="relative">
				<KeyRound className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
				<Input type="password" placeholder="Secret value" className="pl-9" />
			</div>
		</div>
	),
};

export const ErrorState: Story = {
	render: () => (
		<div className="flex max-w-sm flex-col gap-2">
			<Input
				aria-label="Stack reference"
				aria-invalid="true"
				defaultValue="invalid-stack-ref"
				aria-describedby="error-hint"
			/>
			<p id="error-hint" className="text-destructive text-xs">
				Stack component not found in this workspace.
			</p>
		</div>
	),
};

export const FileUpload: Story = {
	render: () => (
		<div className="flex max-w-sm flex-col gap-1.5">
			<Input
				type="file"
				aria-label="Upload config file"
				accept=".yaml,.yml,.json"
			/>
		</div>
	),
};

/**
 * Realistic composed example: a settings-style form with label, helper text,
 * and an inline search filter — patterns that appear throughout the app.
 */
export const Composed: Story = {
	render: () => (
		<div className="flex max-w-sm flex-col gap-6">
			<div className="flex flex-col gap-1.5">
				<label htmlFor="stack-name" className="text-sm font-medium">
					Stack name
				</label>
				<Input id="stack-name" defaultValue="zenml-eu-central" />
				<p className="text-muted-foreground text-xs">
					Must be unique within the workspace.
				</p>
			</div>

			<div className="flex flex-col gap-1.5">
				<label htmlFor="artifact-store-uri" className="text-sm font-medium">
					Artifact store URI
				</label>
				<div className="relative">
					<Server className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
					<Input
						id="artifact-store-uri"
						type="url"
						placeholder="gs://my-bucket/artifacts"
						className="pl-9"
					/>
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<label htmlFor="api-token" className="text-sm font-medium">
					API token
				</label>
				<Input
					id="api-token"
					type="password"
					placeholder="zenml_…"
					aria-invalid="true"
				/>
				<p className="text-destructive text-xs">
					Token has expired. Rotate it in API Keys.
				</p>
			</div>

			<div className="flex flex-col gap-1.5">
				<label htmlFor="member-search" className="text-sm font-medium">
					Invite member
				</label>
				<div className="relative">
					<Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
					<Input
						id="member-search"
						type="email"
						placeholder="name@company.com"
						className="pl-9"
					/>
				</div>
			</div>
		</div>
	),
};
