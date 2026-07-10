import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ExecStatus, FlowStatus } from "@zenml/hashi/lib/state-styles";

import { StatusDot } from "./StatusDot";

const execStatuses: ExecStatus[] = [
	"running",
	"completed",
	"failed",
	"cached",
	"skipped",
	"retrying",
	"retried",
	"paused",
	"resuming",
	"stopped",
	"stopping",
	"initializing",
	"provisioning",
	"waiting",
	"sleeping",
	"cancelled",
];

const flowStatuses: FlowStatus[] = ["active", "paused", "error"];

const meta: Meta<typeof StatusDot> = {
	title: "Components/StatusDot",
	component: StatusDot,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=87-23",
		},
	},
	args: {
		status: "completed",
	},
	argTypes: {
		status: {
			control: "select",
			options: [...execStatuses, ...flowStatuses],
		},
	},
};

export default meta;
type Story = StoryObj<typeof StatusDot>;

export const Default: Story = {};

/**
 * All ExecStatus values side-by-side. The semantic color groups are:
 * success (completed), warning (running / retrying / waiting),
 * destructive (failed), teal (initializing / provisioning / resuming),
 * muted (everything else).
 */
export const ExecStatuses: Story = {
	render: () => (
		<div className="flex flex-wrap gap-x-6 gap-y-3">
			{execStatuses.map((status) => (
				<span key={status} className="flex items-center gap-1.5 text-sm">
					<StatusDot status={status} />
					<span className="text-muted-foreground">{status}</span>
				</span>
			))}
		</div>
	),
};

/**
 * FlowStatus values: active, paused, error. Used on pipeline / flow cards
 * and the flows-list table.
 */
export const FlowStatuses: Story = {
	render: () => (
		<div className="flex flex-wrap gap-6">
			{flowStatuses.map((status) => (
				<span key={status} className="flex items-center gap-1.5 text-sm">
					<StatusDot status={status} />
					<span className="text-muted-foreground">{status}</span>
				</span>
			))}
		</div>
	),
};

/**
 * Realistic table row usage: dot + label inside a dense text cell. Mirrors
 * the flows-list table where each row shows the pipeline execution status.
 */
export const InlineWithLabel: Story = {
	render: () => (
		<div className="flex flex-col gap-2">
			{(
				[
					"completed",
					"running",
					"failed",
					"cached",
					"initializing",
					"stopped",
				] as ExecStatus[]
			).map((status) => (
				<span key={status} className="flex items-center gap-1.5 text-sm">
					<StatusDot status={status} />
					{status}
				</span>
			))}
		</div>
	),
};

/**
 * Composed example: a minimal pipeline run list, the way it appears on the
 * dashboard flow card footer. Each row pairs the dot with a run id and
 * duration in the style consumers actually render it.
 */
export const Composed: Story = {
	render: () => (
		<div className="border-border w-72 divide-y rounded-lg border text-sm">
			{[
				{
					id: "run-a4f1c2",
					name: "production-traces",
					status: "completed" as ExecStatus,
					duration: "2m 14s",
				},
				{
					id: "run-b9e3a1",
					name: "nightly-finetune",
					status: "running" as ExecStatus,
					duration: "running",
				},
				{
					id: "run-c7d8f0",
					name: "smoke-test",
					status: "failed" as ExecStatus,
					duration: "0m 43s",
				},
				{
					id: "run-d2b5e9",
					name: "data-validation",
					status: "cached" as ExecStatus,
					duration: "skipped",
				},
				{
					id: "run-e1a6c3",
					name: "model-evaluation",
					status: "initializing" as ExecStatus,
					duration: "queued",
				},
			].map(({ id, name, status, duration }) => (
				<div key={id} className="flex items-center justify-between px-3 py-2">
					<span className="flex items-center gap-2">
						<StatusDot status={status} />
						<span className="text-foreground font-medium">{name}</span>
					</span>
					<span className="text-muted-foreground text-xs">{duration}</span>
				</div>
			))}
		</div>
	),
};

/**
 * Custom className passthrough. Demonstrates that the component accepts
 * arbitrary Tailwind overrides (size, margin) while preserving the status
 * color applied by getStatusDotClass.
 */
export const CustomSize: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<StatusDot status="completed" className="size-2" />
			<StatusDot status="completed" />
			<StatusDot status="completed" className="size-3" />
		</div>
	),
};
