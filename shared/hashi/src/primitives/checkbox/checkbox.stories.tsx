import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
	title: "Primitives/Checkbox",
	component: Checkbox,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=68-11",
		},
	},
	args: {
		disabled: false,
	},
	argTypes: {
		disabled: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
	render: (args) => <Checkbox aria-label="Example checkbox" {...args} />,
};

export const States: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<label className="flex cursor-pointer items-center gap-2.5">
				<Checkbox />
				<span className="text-sm">Unchecked</span>
			</label>
			<label className="flex cursor-pointer items-center gap-2.5">
				<Checkbox defaultChecked />
				<span className="text-sm">Checked</span>
			</label>
			<label className="flex items-center gap-2.5 opacity-50">
				<Checkbox disabled />
				<span className="text-sm">Disabled unchecked</span>
			</label>
			<label className="flex items-center gap-2.5 opacity-50">
				<Checkbox defaultChecked disabled />
				<span className="text-sm">Disabled checked</span>
			</label>
		</div>
	),
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	render: (args) => <Checkbox aria-label="Example checkbox" {...args} />,
};

export const WithLabel: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<label className="flex cursor-pointer items-center gap-2.5">
				<Checkbox defaultChecked />
				<span className="text-foreground text-sm font-medium">
					Enable automatic restarts
				</span>
			</label>
			<label className="flex cursor-pointer items-center gap-2.5">
				<Checkbox />
				<span className="text-foreground text-sm font-medium">
					Send failure notifications
				</span>
			</label>
		</div>
	),
};

export const WithDescription: Story = {
	render: () => (
		<label className="flex cursor-pointer items-start gap-2.5">
			<Checkbox className="mt-0.5" />
			<span className="text-foreground text-sm leading-snug">
				Trust this device — we won't ask again on this device for the next 30
				days
			</span>
		</label>
	),
};

export const CheckboxGroup: Story = {
	name: "Group — column visibility",
	render: () => {
		const columns = [
			{ id: "name", label: "Name", checked: true },
			{ id: "status", label: "Status", checked: true },
			{ id: "stack", label: "Stack", checked: false },
			{ id: "author", label: "Author", checked: true },
			{ id: "duration", label: "Duration", checked: false },
			{ id: "cost", label: "Cost (USD)", checked: false },
		];

		return (
			<div className="flex flex-col gap-1">
				{columns.map((col) => (
					<label
						key={col.id}
						className="flex cursor-pointer items-center gap-2.5 px-2 py-1.5"
					>
						<Checkbox defaultChecked={col.checked} />
						<span className="text-sm">{col.label}</span>
					</label>
				))}
			</div>
		);
	},
};

export const Controlled: Story = {
	render: () => {
		const [checked, setChecked] = useState(false);

		return (
			<div className="flex flex-col gap-4">
				<label className="flex cursor-pointer items-center gap-2.5">
					<Checkbox
						checked={checked}
						onCheckedChange={(value) => setChecked(!!value)}
					/>
					<span className="text-sm">
						{checked ? "Notifications on" : "Notifications off"}
					</span>
				</label>
				<p className="text-muted-foreground text-xs">
					Controlled state: {checked ? "checked" : "unchecked"}
				</p>
			</div>
		);
	},
};

export const TableRowSelection: Story = {
	name: "Composed — table row selection",
	render: () => {
		const rows = [
			{ id: "run-3f2a", name: "Production traces", status: "Completed" },
			{ id: "run-9b1c", name: "zenml-eu-central staging", status: "Running" },
			{ id: "run-c7d4", name: "Feature branch eval", status: "Failed" },
		];

		return (
			<div className="border-border rounded-lg border text-sm">
				<div className="border-border bg-muted/40 flex items-center gap-3 border-b px-4 py-2.5 font-medium">
					<Checkbox defaultChecked aria-label="Select all rows" />
					<span>Select all</span>
				</div>
				{rows.map((row, i) => (
					<div
						key={row.id}
						className={`flex items-center gap-3 px-4 py-3 ${i < rows.length - 1 ? "border-border border-b" : ""}`}
					>
						<Checkbox
							defaultChecked={i !== 2}
							aria-label={`Select ${row.name}`}
						/>
						<div className="flex flex-1 items-center justify-between">
							<span className="text-foreground font-medium">{row.name}</span>
							<span className="text-muted-foreground font-mono text-xs">
								{row.id}
							</span>
						</div>
					</div>
				))}
			</div>
		);
	},
};
