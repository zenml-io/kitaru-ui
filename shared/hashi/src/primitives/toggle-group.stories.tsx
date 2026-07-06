import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { LayoutGrid, List, Braces, FormInput } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta: Meta<typeof ToggleGroup> = {
	title: "Primitives/ToggleGroup",
	component: ToggleGroup,
	args: {
		variant: "default",
		size: "default",
		spacing: 0,
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "outline", "pill"],
		},
		size: {
			control: "select",
			options: ["sm", "default", "lg"],
		},
		spacing: {
			control: "number",
			description:
				"Gap between items in spacing units (0 = joined segment bar, 1+ = separated pills).",
		},
	},
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

// ---------------------------------------------------------------------------
// Default — args-driven, wired to local state so the toggle is interactive
// ---------------------------------------------------------------------------

function DefaultDemo(args: React.ComponentProps<typeof ToggleGroup>) {
	const [value, setValue] = React.useState("tree");
	return (
		<ToggleGroup {...args} value={value} onValueChange={setValue}>
			<ToggleGroupItem value="tree">Tree</ToggleGroupItem>
			<ToggleGroupItem value="timeline">Timeline</ToggleGroupItem>
			<ToggleGroupItem value="logs">Logs</ToggleGroupItem>
		</ToggleGroup>
	);
}

export const Default: Story = {
	render: (args) => <DefaultDemo {...args} />,
};

// ---------------------------------------------------------------------------
// Variants — default · outline · pill
// ---------------------------------------------------------------------------

function VariantRow({
	variant,
	label,
	spacing = 0,
}: {
	variant: "default" | "outline" | "pill";
	label: string;
	spacing?: number;
}) {
	const [value, setValue] = React.useState("b");
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-muted-foreground text-xs font-medium">{label}</span>
			<ToggleGroup
				variant={variant}
				spacing={spacing}
				value={value}
				onValueChange={setValue}
			>
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
				<ToggleGroupItem value="c">Option C</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}

export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap items-start gap-8">
			<VariantRow variant="default" label="default" />
			<VariantRow variant="outline" label="outline" />
			<VariantRow variant="pill" label="pill" spacing={1} />
		</div>
	),
};

// ---------------------------------------------------------------------------
// Sizes — sm · default · lg
// ---------------------------------------------------------------------------

function SizeRow({
	size,
	label,
}: {
	size: "sm" | "default" | "lg";
	label: string;
}) {
	const [value, setValue] = React.useState("grid");
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-muted-foreground text-xs font-medium">{label}</span>
			<ToggleGroup
				variant="outline"
				size={size}
				value={value}
				onValueChange={setValue}
			>
				<ToggleGroupItem value="grid">Grid</ToggleGroupItem>
				<ToggleGroupItem value="list">List</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-8">
			<SizeRow size="sm" label="sm" />
			<SizeRow size="default" label="default" />
			<SizeRow size="lg" label="lg" />
		</div>
	),
};

// ---------------------------------------------------------------------------
// Spacing — joined (spacing=0) vs separated (spacing=1)
// ---------------------------------------------------------------------------

function SpacingDemo({ spacing, label }: { spacing: number; label: string }) {
	const [value, setValue] = React.useState("all");
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-muted-foreground text-xs font-medium">{label}</span>
			<ToggleGroup
				variant="outline"
				size="sm"
				spacing={spacing}
				value={value}
				onValueChange={setValue}
			>
				<ToggleGroupItem value="all">All</ToggleGroupItem>
				<ToggleGroupItem value="completed">Completed</ToggleGroupItem>
				<ToggleGroupItem value="failed">Failed</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}

export const Spacing: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<SpacingDemo spacing={0} label="spacing=0 (joined segment bar)" />
			<SpacingDemo spacing={1} label="spacing=1 (separated pills)" />
		</div>
	),
};

// ---------------------------------------------------------------------------
// WithIcon — icon + label inside items
// ---------------------------------------------------------------------------

function WithIconDemo() {
	const [value, setValue] = React.useState("grid");
	return (
		<ToggleGroup
			variant="outline"
			size="sm"
			value={value}
			onValueChange={setValue}
		>
			<ToggleGroupItem value="grid">
				<LayoutGrid className="size-3.5" />
				Grid
			</ToggleGroupItem>
			<ToggleGroupItem value="list">
				<List className="size-3.5" />
				List
			</ToggleGroupItem>
		</ToggleGroup>
	);
}

export const WithIcon: Story = {
	render: () => <WithIconDemo />,
};

// ---------------------------------------------------------------------------
// IconOnly — icon-only items (no text)
// ---------------------------------------------------------------------------

function IconOnlyDemo() {
	const [value, setValue] = React.useState("grid");
	return (
		<ToggleGroup
			variant="outline"
			size="sm"
			value={value}
			onValueChange={setValue}
		>
			<ToggleGroupItem value="grid" aria-label="Grid view">
				<LayoutGrid className="size-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="list" aria-label="List view">
				<List className="size-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}

export const IconOnly: Story = {
	render: () => <IconOnlyDemo />,
};

// ---------------------------------------------------------------------------
// States — default idle, one selected, disabled item, all disabled
// ---------------------------------------------------------------------------

export const States: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1.5">
				<span className="text-muted-foreground text-xs font-medium">
					No selection
				</span>
				<ToggleGroup
					variant="outline"
					size="sm"
					value=""
					onValueChange={() => {}}
				>
					<ToggleGroupItem value="form">Form</ToggleGroupItem>
					<ToggleGroupItem value="json">JSON</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<div className="flex flex-col gap-1.5">
				<span className="text-muted-foreground text-xs font-medium">
					One item selected
				</span>
				<ToggleGroup
					variant="outline"
					size="sm"
					value="json"
					onValueChange={() => {}}
				>
					<ToggleGroupItem value="form">Form</ToggleGroupItem>
					<ToggleGroupItem value="json">JSON</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<div className="flex flex-col gap-1.5">
				<span className="text-muted-foreground text-xs font-medium">
					One item disabled
				</span>
				<ToggleGroup
					variant="outline"
					size="sm"
					value="form"
					onValueChange={() => {}}
				>
					<ToggleGroupItem value="form">Form</ToggleGroupItem>
					<ToggleGroupItem value="json" disabled>
						JSON
					</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<div className="flex flex-col gap-1.5">
				<span className="text-muted-foreground text-xs font-medium">
					All items disabled
				</span>
				<ToggleGroup
					variant="outline"
					size="sm"
					value="tree"
					onValueChange={() => {}}
					disabled
				>
					<ToggleGroupItem value="tree">Tree</ToggleGroupItem>
					<ToggleGroupItem value="timeline">Timeline</ToggleGroupItem>
				</ToggleGroup>
			</div>
		</div>
	),
};

// ---------------------------------------------------------------------------
// FilterPills — pill variant with spacing=1; real-world status filter pattern
// ---------------------------------------------------------------------------

const statusOptions = [
	{ value: "all", label: "All" },
	{ value: "completed", label: "Completed" },
	{ value: "failed", label: "Failed" },
	{ value: "running", label: "Running" },
	{ value: "cached", label: "Cached" },
];

function FilterPillsDemo() {
	const [status, setStatus] = React.useState("all");
	return (
		<ToggleGroup
			variant="pill"
			size="sm"
			spacing={1}
			value={status}
			onValueChange={(v) => {
				if (v) setStatus(v);
			}}
			aria-label="Filter by status"
		>
			{statusOptions.map((opt) => (
				<ToggleGroupItem
					key={opt.value}
					value={opt.value}
					aria-label={opt.label}
				>
					{opt.label}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}

export const FilterPills: Story = {
	render: () => <FilterPillsDemo />,
};

// ---------------------------------------------------------------------------
// Composed — toolbar mimicking the execution-detail trace viewer toolbar:
// view-mode switcher + input-mode switcher side by side, separated by a rule
// ---------------------------------------------------------------------------

function ComposedToolbarDemo() {
	const [traceView, setTraceView] = React.useState("tree");
	const [inputMode, setInputMode] = React.useState("form");

	return (
		<div className="border-border flex w-full items-center gap-3 rounded-lg border px-4 py-2.5">
			{/* Trace view switcher */}
			<span className="text-muted-foreground text-xs">View</span>
			<ToggleGroup
				variant="outline"
				size="sm"
				value={traceView}
				onValueChange={(v) => {
					if (v) setTraceView(v);
				}}
			>
				<ToggleGroupItem value="tree">Tree</ToggleGroupItem>
				<ToggleGroupItem value="timeline">Timeline</ToggleGroupItem>
			</ToggleGroup>

			<div
				role="separator"
				aria-orientation="vertical"
				className="bg-border h-5 w-px shrink-0"
			/>

			{/* Input mode switcher with icons */}
			<span className="text-muted-foreground text-xs">Input</span>
			<ToggleGroup
				variant="outline"
				size="sm"
				value={inputMode}
				onValueChange={(v) => {
					if (v) setInputMode(v);
				}}
				aria-label="Input mode"
			>
				<ToggleGroupItem value="form" aria-label="Form view">
					<FormInput className="size-3.5" />
					Form
				</ToggleGroupItem>
				<ToggleGroupItem value="json" aria-label="JSON view">
					<Braces className="size-3.5" />
					JSON
				</ToggleGroupItem>
			</ToggleGroup>

			<div className="ml-auto">
				<span className="text-muted-foreground text-xs tabular-nums">
					248 spans · 1m 42s
				</span>
			</div>
		</div>
	);
}

export const ComposedToolbar: Story = {
	render: () => (
		<div className="w-[600px]">
			<ComposedToolbarDemo />
		</div>
	),
};
