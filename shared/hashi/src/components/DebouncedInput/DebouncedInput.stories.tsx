import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Search } from "lucide-react";

import { DebouncedInput } from "./DebouncedInput";

const meta: Meta<typeof DebouncedInput> = {
	title: "Components/DebouncedInput",
	component: DebouncedInput,
	args: {
		value: "",
		placeholder: "Search...",
		debounceMs: 300,
		disabled: false,
	},
	argTypes: {
		debounceMs: {
			control: { type: "number", min: 0, max: 2000, step: 50 },
		},
	},
};

export default meta;
type Story = StoryObj<typeof DebouncedInput>;

// ---------------------------------------------------------------------------
// Default — args-driven playground
// ---------------------------------------------------------------------------

export const Default: Story = {
	render: (args) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [value, setValue] = useState(args.value ?? "");
		return (
			<div className="flex w-64 flex-col gap-3">
				<DebouncedInput
					{...args}
					value={value}
					onValueChange={setValue}
					placeholder={args.placeholder}
				/>
				<p className="text-muted-foreground text-xs">
					Live:{" "}
					<span className="text-foreground font-mono">{value || "—"}</span>
				</p>
			</div>
		);
	},
};

// ---------------------------------------------------------------------------
// Callbacks — shows all three change handlers firing independently
// ---------------------------------------------------------------------------

export const Callbacks: Story = {
	render: () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [controlled, setControlled] = useState("");
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [liveValue, setLiveValue] = useState("");
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [debouncedValue, setDebouncedValue] = useState("");

		return (
			<div className="flex w-72 flex-col gap-4">
				<DebouncedInput
					value={controlled}
					placeholder="Type to see callbacks fire..."
					debounceMs={400}
					onValueChange={(v) => {
						setControlled(v);
						setLiveValue(v);
					}}
					onDebouncedValueChange={setDebouncedValue}
				/>
				<dl className="space-y-1 text-xs">
					<div className="flex justify-between gap-2">
						<dt className="text-muted-foreground">onValueChange (live)</dt>
						<dd className="text-foreground truncate font-mono">
							{liveValue || "—"}
						</dd>
					</div>
					<div className="flex justify-between gap-2">
						<dt className="text-muted-foreground">
							onDebouncedValueChange (400 ms)
						</dt>
						<dd className="text-foreground truncate font-mono">
							{debouncedValue || "—"}
						</dd>
					</div>
				</dl>
				<p className="text-muted-foreground text-xs">
					The debounced value lags behind as expected. Fast typists see the live
					value update immediately; the debounced value settles 400 ms after the
					last keystroke.
				</p>
			</div>
		);
	},
};

// ---------------------------------------------------------------------------
// ExternalReset — controlled value reset from outside
// ---------------------------------------------------------------------------

export const ExternalReset: Story = {
	name: "External Reset",
	render: () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [value, setValue] = useState("training-pipeline");

		return (
			<div className="flex w-72 flex-col gap-3">
				<DebouncedInput
					value={value}
					placeholder="Search flows..."
					debounceMs={300}
					onValueChange={setValue}
				/>
				<div className="flex gap-2">
					<button
						type="button"
						className="text-muted-foreground hover:text-foreground text-xs underline"
						onClick={() => setValue("")}
					>
						Clear
					</button>
					<button
						type="button"
						className="text-muted-foreground hover:text-foreground text-xs underline"
						onClick={() => setValue("training-pipeline")}
					>
						Reset to default
					</button>
				</div>
				<p className="text-muted-foreground text-xs">
					When the parent sets a new controlled value the input resets
					immediately (pending debounce is cancelled).
				</p>
			</div>
		);
	},
};

// ---------------------------------------------------------------------------
// Disabled
// ---------------------------------------------------------------------------

export const Disabled: Story = {
	args: {
		value: "checkout-pipeline",
		disabled: true,
		placeholder: "Search flows...",
	},
	render: (args) => (
		<div className="w-64">
			<DebouncedInput {...args} />
		</div>
	),
};

// ---------------------------------------------------------------------------
// Composed — toolbar search pattern (mirrors FlowsToolbar real call site)
// ---------------------------------------------------------------------------

export const Composed: Story = {
	name: "Composed — Toolbar Search",
	render: () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [search, setSearch] = useState("");
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [committed, setCommitted] = useState("");

		return (
			<div className="flex flex-col gap-4">
				<div className="bg-card border-border flex items-center gap-2 rounded-lg border px-3 py-2">
					<Search
						className="text-muted-foreground size-4 shrink-0"
						aria-hidden
					/>
					<DebouncedInput
						value={search}
						placeholder="Search production traces..."
						debounceMs={300}
						className="w-48 border-0 bg-transparent px-0 font-mono shadow-none focus-visible:ring-0"
						onValueChange={setSearch}
						onDebouncedValueChange={setCommitted}
					/>
				</div>
				<p className="text-muted-foreground text-xs">
					Committed query (sent to server):{" "}
					<span className="text-foreground font-mono">{committed || "—"}</span>
				</p>
			</div>
		);
	},
};
