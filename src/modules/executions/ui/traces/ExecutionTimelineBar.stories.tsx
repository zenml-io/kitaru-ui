import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExecutionTimelineBar } from "./ExecutionTimelineBar";
import type { TimelineEntry } from "../../domain/waiting-block";

function checkpoint(
	id: string,
	name: string,
	type: "llm_call" | "tool_call",
	durationMs?: number
): TimelineEntry {
	return {
		kind: "checkpoint",
		data: {
			id,
			name,
			type,
			durationMs,
			status: "completed",
			startTime: new Date("2026-01-01T00:00:00Z"),
		},
	};
}

function waitBlock(id: string, waitDurationMs?: number): TimelineEntry {
	return {
		kind: "waiting",
		data: {
			id,
			question: "Approve?",
			answer: "yes",
			waitDurationMs,
			createdAt: new Date("2026-01-01T00:00:00Z"),
		},
	};
}

const meta: Meta<typeof ExecutionTimelineBar> = {
	title: "Executions/Traces/ExecutionTimelineBar",
	component: ExecutionTimelineBar,
	args: {
		onSelect: () => {},
	},
	parameters: {
		layout: "padded",
	},
	decorators: [
		(Story) => (
			<div className="w-full max-w-3xl border">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof ExecutionTimelineBar>;

export const MixedDurations: Story = {
	args: {
		timelineEntries: [
			checkpoint("1", "llm_0", "llm_call", 300_000),
			checkpoint("2", "run_command_0", "tool_call", 5_000),
			checkpoint("3", "llm_1", "llm_call", 45_000),
			checkpoint("4", "read_file_1", "tool_call", 1_200),
			checkpoint("5", "llm_2", "llm_call", 120_000),
		],
	},
};

export const AllCached: Story = {
	args: {
		timelineEntries: [
			checkpoint("1", "llm_0", "llm_call", 0),
			checkpoint("2", "run_command_0", "tool_call", 0),
			checkpoint("3", "llm_1", "llm_call", 0),
			checkpoint("4", "read_file_1", "tool_call", 0),
			checkpoint("5", "llm_2", "llm_call", 0),
			checkpoint("6", "read_file_2", "tool_call", 0),
			checkpoint("7", "llm_3", "llm_call", 0),
		],
	},
};

export const SomeCached: Story = {
	args: {
		timelineEntries: [
			checkpoint("1", "llm_0", "llm_call", 0),
			checkpoint("2", "run_command_0", "tool_call", 8_000),
			checkpoint("3", "llm_1", "llm_call", 0),
			checkpoint("4", "read_file_1", "tool_call", 0),
			checkpoint("5", "llm_2", "llm_call", 60_000),
		],
	},
};

export const SingleCheckpoint: Story = {
	args: {
		timelineEntries: [checkpoint("1", "llm_0", "llm_call", 15_000)],
	},
};

export const SingleCachedCheckpoint: Story = {
	args: {
		timelineEntries: [checkpoint("1", "llm_0", "llm_call", 0)],
	},
};

export const WithWaitBlocks: Story = {
	args: {
		timelineEntries: [
			checkpoint("1", "llm_0", "llm_call", 30_000),
			waitBlock("w1", 120_000),
			checkpoint("2", "llm_1", "llm_call", 15_000),
			checkpoint("3", "run_command_0", "tool_call", 3_000),
		],
	},
};

export const OneLongManyShort: Story = {
	args: {
		timelineEntries: [
			checkpoint("1", "llm_main", "llm_call", 600_000),
			...Array.from({ length: 10 }, (_, i) =>
				checkpoint(`s${i}`, `tool_${i}`, "tool_call", 1_000)
			),
		],
	},
};

export const ManyCheckpoints: Story = {
	args: {
		timelineEntries: Array.from({ length: 30 }, (_, i) =>
			checkpoint(
				`${i}`,
				`step_${i}`,
				i % 2 === 0 ? "llm_call" : "tool_call",
				Math.random() * 50_000 + 500
			)
		),
	},
};

export const FiveHundredCheckpoints: Story = {
	args: {
		timelineEntries: Array.from({ length: 500 }, (_, i) =>
			checkpoint(
				`${i}`,
				`step_${i}`,
				i % 2 === 0 ? "llm_call" : "tool_call",
				Math.random() * 300_000 + 100
			)
		),
	},
};
