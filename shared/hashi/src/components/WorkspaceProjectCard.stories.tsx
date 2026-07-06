import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	ProjectStatistics,
	WorkspaceProjectCard,
} from "./WorkspaceProjectCard";

const meta: Meta<typeof WorkspaceProjectCard> = {
	title: "Components/WorkspaceProjectCard",
	component: WorkspaceProjectCard,
	parameters: {
		layout: "centered",
	},
	args: {
		name: "production-traces",
		path: "/zenml/production-traces",
		statisticsSlot: <ProjectStatistics flows={12} executions={847} />,
		gradient: "zen-green",
	},
	argTypes: {
		gradient: {
			control: "select",
			options: ["zen-green", "zen-slate", "zen-sand", "kitaru-amber"],
		},
	},
	decorators: [
		(Story) => (
			<div className="w-64">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof WorkspaceProjectCard>;

export const Default: Story = {};

// All four gradient themes. zen-green and zen-slate are ZenML surfaces;
// kitaru-amber is the Kitaru brand gradient; zen-sand is neutral/warm.
export const Gradients: Story = {
	render: () => (
		<div className="grid grid-cols-2 gap-4">
			<div className="flex flex-col gap-1.5">
				<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					zen-green
				</span>
				<WorkspaceProjectCard
					name="production-traces"
					path="/zenml/production-traces"
					statisticsSlot={<ProjectStatistics flows={12} executions={847} />}
					gradient="zen-green"
				/>
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					zen-slate
				</span>
				<WorkspaceProjectCard
					name="feature-experiments"
					path="/zenml/feature-experiments"
					statisticsSlot={<ProjectStatistics flows={4} executions={119} />}
					gradient="zen-slate"
				/>
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					zen-sand
				</span>
				<WorkspaceProjectCard
					name="data-ingestion"
					path="/zenml/data-ingestion"
					statisticsSlot={<ProjectStatistics flows={7} executions={302} />}
					gradient="zen-sand"
				/>
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					kitaru-amber
				</span>
				<WorkspaceProjectCard
					name="model-training"
					path="/kitaru/model-training"
					statisticsSlot={<ProjectStatistics flows={9} executions={1204} />}
					gradient="kitaru-amber"
				/>
			</div>
		</div>
	),
	decorators: [
		(Story) => (
			<div className="w-[560px]">
				<Story />
			</div>
		),
	],
};

// Long project name and path to confirm the truncate behaviour on both lines.
export const LongTextTruncation: Story = {
	render: () => (
		<WorkspaceProjectCard
			name="feature-multi-modal-retrieval-augmented-generation"
			path="/zenml-eu-central-1/feature-multi-modal-retrieval-augmented-generation"
			statisticsSlot={<ProjectStatistics flows={3} executions={41} />}
			gradient="zen-green"
		/>
	),
};

// Zero and singular counts — freshly-created projects, and the "1 flow" /
// "1 execution" singular labels ProjectStatistics switches to.
export const EmptyCounts: Story = {
	render: () => (
		<div className="grid grid-cols-2 gap-4">
			<WorkspaceProjectCard
				name="sandbox"
				path="/zenml/sandbox"
				statisticsSlot={<ProjectStatistics flows={0} executions={0} />}
				gradient="zen-slate"
			/>
			<WorkspaceProjectCard
				name="smoke-test"
				path="/zenml/smoke-test"
				statisticsSlot={<ProjectStatistics flows={1} executions={1} />}
				gradient="zen-sand"
			/>
		</div>
	),
	decorators: [
		(Story) => (
			<div className="w-[560px]">
				<Story />
			</div>
		),
	],
};

// statisticsSlot is optional — consumers without counts render just the
// identity block under the gradient.
export const NoStatistics: Story = {
	render: () => (
		<WorkspaceProjectCard
			name="data-ingestion"
			path="/zenml/data-ingestion"
			gradient="zen-green"
		/>
	),
};

// Large counts confirm tabular-num alignment doesn't break layout.
export const LargeCounts: Story = {
	render: () => (
		<WorkspaceProjectCard
			name="production-traces"
			path="/zenml/production-traces"
			statisticsSlot={<ProjectStatistics flows={1000} executions={99999} />}
			gradient="zen-green"
		/>
	),
};

// Realistic workspace projects grid — three cards as a consumer would render
// them inside a workspace overview page.
export const ComposedGrid: Story = {
	render: () => (
		<div className="grid grid-cols-3 gap-4">
			<WorkspaceProjectCard
				name="production-traces"
				path="/zenml-eu-central/production-traces"
				statisticsSlot={<ProjectStatistics flows={12} executions={847} />}
				gradient="zen-green"
			/>
			<WorkspaceProjectCard
				name="feature-rag-v2"
				path="/zenml-eu-central/feature-rag-v2"
				statisticsSlot={<ProjectStatistics flows={5} executions={203} />}
				gradient="zen-slate"
			/>
			<WorkspaceProjectCard
				name="data-ingestion"
				path="/zenml-eu-central/data-ingestion"
				statisticsSlot={<ProjectStatistics flows={3} executions={1104} />}
				gradient="zen-sand"
			/>
		</div>
	),
	decorators: [
		(Story) => (
			<div className="w-[720px]">
				<Story />
			</div>
		),
	],
};
