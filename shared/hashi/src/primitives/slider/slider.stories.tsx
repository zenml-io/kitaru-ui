import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../card/card";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { Slider } from "./slider";

/**
 * Single-thumb slider built on Base UI, used for continuous controls such as
 * LLM temperature or top-p. It is fully controlled: pass `value` plus an
 * `onValueChange` handler. Every slider needs an `aria-label` so the thumb
 * carries an accessible name.
 */
const meta: Meta<typeof Slider> = {
	title: "Primitives/Slider",
	component: Slider,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=251-13",
		},
	},
	args: {
		min: 0,
		max: 1,
		step: 0.1,
		disabled: false,
		"aria-label": "Temperature",
	},
	argTypes: {
		min: { control: "number" },
		max: { control: "number" },
		step: { control: "number" },
		disabled: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof Slider>;

// ─── Default (args-driven) ────────────────────────────────────────────────────

export const Default: Story = {
	render: function Render(args) {
		const [value, setValue] = React.useState(0.7);
		return (
			<div className="w-72">
				<Slider {...args} value={value} onValueChange={setValue} />
			</div>
		);
	},
};

// ─── Positions ────────────────────────────────────────────────────────────────

/** The thumb at the low, middle, and high end of a 0–1 range. */
export const Positions: Story = {
	render: function Render() {
		const [low, setLow] = React.useState(0);
		const [mid, setMid] = React.useState(0.5);
		const [high, setHigh] = React.useState(1);
		return (
			<div className="flex w-72 flex-col gap-6">
				<Slider value={low} onValueChange={setLow} aria-label="Low" />
				<Slider value={mid} onValueChange={setMid} aria-label="Middle" />
				<Slider value={high} onValueChange={setHigh} aria-label="High" />
			</div>
		);
	},
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
	render: function Render() {
		const [value, setValue] = React.useState(0.4);
		return (
			<div className="w-72">
				<Slider
					value={value}
					onValueChange={setValue}
					disabled
					aria-label="Locked temperature"
				/>
			</div>
		);
	},
};

// ─── Ranges ───────────────────────────────────────────────────────────────────

/**
 * min / max / step configure the domain. These mirror the model-parameter
 * ranges used in the replay editor: temperature and top-p on 0–1, and an
 * integer token budget on a wider stepped range.
 */
export const Ranges: Story = {
	render: function Render() {
		const [temperature, setTemperature] = React.useState(0.7);
		const [topP, setTopP] = React.useState(0.9);
		const [maxTokens, setMaxTokens] = React.useState(2048);
		return (
			<div className="flex w-72 flex-col gap-6">
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between text-sm">
						<span className="font-medium">Temperature</span>
						<span className="text-muted-foreground font-mono tabular-nums">
							{temperature.toFixed(1)}
						</span>
					</div>
					<Slider
						value={temperature}
						onValueChange={setTemperature}
						min={0}
						max={1}
						step={0.1}
						aria-label="Temperature"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between text-sm">
						<span className="font-medium">Top P</span>
						<span className="text-muted-foreground font-mono tabular-nums">
							{topP.toFixed(2)}
						</span>
					</div>
					<Slider
						value={topP}
						onValueChange={setTopP}
						min={0}
						max={1}
						step={0.05}
						aria-label="Top P"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between text-sm">
						<span className="font-medium">Max tokens</span>
						<span className="text-muted-foreground font-mono tabular-nums">
							{maxTokens}
						</span>
					</div>
					<Slider
						value={maxTokens}
						onValueChange={setMaxTokens}
						min={256}
						max={4096}
						step={256}
						aria-label="Max tokens"
					/>
				</div>
			</div>
		);
	},
};

// ─── Controlled (external readout) ────────────────────────────────────────────

/** The value is owned by React state; a live readout reflects every change. */
export const Controlled: Story = {
	render: function Render() {
		const [value, setValue] = React.useState(0.6);
		return (
			<div className="flex w-72 flex-col gap-3">
				<Slider
					value={value}
					onValueChange={setValue}
					min={0}
					max={1}
					step={0.1}
					aria-label="Temperature"
				/>
				<p className="text-muted-foreground text-sm">
					Temperature:{" "}
					<span className="text-foreground font-mono font-semibold tabular-nums">
						{value.toFixed(1)}
					</span>
				</p>
			</div>
		);
	},
};

// ─── Composed (replay parameter field) ────────────────────────────────────────

/**
 * A labeled Slider paired with a numeric readout Input — the exact composition
 * used by the replay defaults panel. Each row can be flagged as overridden from
 * the checkpoint default.
 */
function ParamField({
	id,
	label,
	value,
	onChange,
	min,
	max,
	step,
	format,
	overridden,
}: {
	id: string;
	label: string;
	value: number;
	onChange: (value: number) => void;
	min: number;
	max: number;
	step: number;
	format: (value: number) => string;
	overridden?: boolean;
}) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<Label htmlFor={id}>{label}</Label>
				{overridden && <span className="text-primary text-xs">Overridden</span>}
			</div>
			<div className="flex items-center gap-3">
				<Slider
					value={value}
					onValueChange={onChange}
					min={min}
					max={max}
					step={step}
					aria-label={label}
					className="flex-1"
				/>
				<Input
					id={id}
					type="text"
					value={format(value)}
					readOnly
					aria-label={`${label} value`}
					className="h-auto w-16 px-2 py-1 text-center font-mono text-sm tabular-nums"
				/>
			</div>
		</div>
	);
}

export const Composed: Story = {
	render: function Render() {
		const [temperature, setTemperature] = React.useState(0.7);
		const [topP, setTopP] = React.useState(0.9);
		return (
			<Card className="w-96">
				<CardHeader>
					<CardTitle>Replay defaults</CardTitle>
					<CardDescription>
						Used by re-run checkpoints that don't carry their own model
						parameters.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
					<ParamField
						id="composed-temperature"
						label="Temperature"
						value={temperature}
						onChange={setTemperature}
						min={0}
						max={1}
						step={0.1}
						format={(v) => v.toFixed(1)}
						overridden
					/>
					<ParamField
						id="composed-top-p"
						label="Top P"
						value={topP}
						onChange={setTopP}
						min={0}
						max={1}
						step={0.05}
						format={(v) => v.toFixed(2)}
					/>
				</CardContent>
			</Card>
		);
	},
};
