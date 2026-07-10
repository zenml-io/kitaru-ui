import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart2, Clock, MoreHorizontal, Search, Zap } from "lucide-react";

import { Button } from "../button/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card";
import { IconButton } from "../icon-button/icon-button";

const meta: Meta<typeof Card> = {
	title: "Primitives/Card",
	component: Card,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=80-5",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Card>;

// ---------------------------------------------------------------------------
// Default — minimal shell, drives the args panel
// ---------------------------------------------------------------------------
export const Default: Story = {
	render: () => (
		<Card className="w-80">
			<CardHeader>
				<CardTitle>Card title</CardTitle>
				<CardDescription>Supporting description text</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground text-sm">
					Card body content goes here.
				</p>
			</CardContent>
		</Card>
	),
};

// ---------------------------------------------------------------------------
// Anatomy — every named slot visible at once
// ---------------------------------------------------------------------------
export const Anatomy: Story = {
	render: () => (
		<Card className="w-80">
			<CardHeader>
				<CardTitle>Pipeline Health</CardTitle>
				<CardDescription>zenml-eu-central · last 7 days</CardDescription>
				<CardAction>
					<IconButton
						variant="ghost"
						icon={<MoreHorizontal />}
						label="More options"
					/>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground text-sm">
					342 successful runs, 4 failures, 1 running.
				</p>
			</CardContent>
			<CardFooter className="gap-2">
				<span className="text-muted-foreground text-xs">Updated 2 min ago</span>
			</CardFooter>
		</Card>
	),
};

// ---------------------------------------------------------------------------
// WithAction — CardAction slots a control into the header grid's second column
// ---------------------------------------------------------------------------
export const WithAction: Story = {
	render: () => (
		<div className="flex w-80 flex-col gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Production traces</CardTitle>
					<CardDescription>training_pipeline · 5 runs today</CardDescription>
					<CardAction>
						<IconButton
							variant="ghost"
							icon={<MoreHorizontal />}
							label="More options"
						/>
					</CardAction>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">
						Last execution completed in 4m 12s.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Cost Summary</CardTitle>
					<CardDescription>Last 24 hours</CardDescription>
					<CardAction>
						<span className="text-muted-foreground text-xs tabular-nums">
							$12.47
						</span>
					</CardAction>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">+8.3% from yesterday</p>
				</CardContent>
			</Card>
		</div>
	),
};

// ---------------------------------------------------------------------------
// HeaderOnly — card with no body (summary tiles, stat cards)
// ---------------------------------------------------------------------------
export const HeaderOnly: Story = {
	render: () => (
		<div className="grid w-[720px] grid-cols-3 gap-4">
			{[
				{ label: "Total runs", value: "1,284", delta: "+12 today" },
				{ label: "Avg duration", value: "3m 41s", delta: "-8s vs last week" },
				{ label: "Active stacks", value: "7", delta: "2 provisioning" },
			].map((stat) => (
				<Card key={stat.label} className="gap-2 p-4">
					<CardHeader className="p-0">
						<CardTitle className="text-muted-foreground text-sm font-medium">
							{stat.label}
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<div className="text-2xl font-bold tabular-nums">{stat.value}</div>
						<p className="text-muted-foreground mt-1 text-xs">{stat.delta}</p>
					</CardContent>
				</Card>
			))}
		</div>
	),
};

// ---------------------------------------------------------------------------
// WithFooter — footer used for actions or metadata
// ---------------------------------------------------------------------------
export const WithFooter: Story = {
	render: () => (
		<div className="grid w-[560px] grid-cols-2 gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Agent Run #142</CardTitle>
					<CardDescription>research_agent · 3.2s</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4 text-sm">
						<span className="font-mono text-xs font-medium tabular-nums">
							$0.0234
						</span>
						<span className="text-muted-foreground">2,481 tokens</span>
					</div>
				</CardContent>
				<CardFooter>
					<Button variant="outline" size="sm" className="w-full">
						View details
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>Common operations</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<Button variant="outline" size="sm" className="w-full justify-start">
						<BarChart2 className="size-4" />
						New run
					</Button>
					<Button variant="outline" size="sm" className="w-full justify-start">
						<Search className="size-4" />
						Compare runs
					</Button>
				</CardContent>
				<CardFooter>
					<span className="text-muted-foreground flex items-center gap-1 text-xs">
						<Clock className="size-3" />
						Last action 12 min ago
					</span>
				</CardFooter>
			</Card>
		</div>
	),
};

// ---------------------------------------------------------------------------
// Interactive — hover:shadow-md pattern used for clickable cards
// ---------------------------------------------------------------------------
export const Interactive: Story = {
	render: () => (
		<div className="grid w-[720px] grid-cols-3 gap-4">
			{[
				{
					name: "feature-engineering",
					workspace: "zenml-eu-central",
					runs: 48,
					icon: <Zap className="text-warning size-4" />,
				},
				{
					name: "model-evaluation",
					workspace: "zenml-eu-central",
					runs: 91,
					icon: <BarChart2 className="text-success size-4" />,
				},
				{
					name: "data-ingestion",
					workspace: "zenml-us-east",
					runs: 217,
					icon: <Search className="text-info size-4" />,
				},
			].map((p) => (
				<Card
					key={p.name}
					className="dark:hover:border-foreground/20 cursor-pointer hover:shadow-md"
				>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							{p.icon}
							{p.name}
						</CardTitle>
						<CardDescription>{p.workspace}</CardDescription>
					</CardHeader>
					<CardContent>
						<span className="text-muted-foreground text-sm tabular-nums">
							{p.runs} runs
						</span>
					</CardContent>
				</Card>
			))}
		</div>
	),
};

// ---------------------------------------------------------------------------
// LongText — truncation behavior for overflowing titles and descriptions
// ---------------------------------------------------------------------------
export const LongText: Story = {
	render: () => (
		<Card className="w-64">
			<CardHeader>
				<CardTitle className="truncate">
					continuous-training-with-data-drift-detection-v2
				</CardTitle>
				<CardDescription className="line-clamp-2">
					Scheduled nightly pipeline that retrains the recommendation model when
					upstream data drift exceeds the configured threshold across all
					feature groups.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<span className="text-muted-foreground text-sm">Last run: 6h ago</span>
			</CardContent>
		</Card>
	),
};

// ---------------------------------------------------------------------------
// BorderDashed — used for empty-slot placeholders
// ---------------------------------------------------------------------------
export const BorderDashed: Story = {
	render: () => (
		<Card className="w-80 border-dashed p-8 text-center">
			<CardContent className="p-0">
				<p className="text-muted-foreground text-sm">
					No pipelines yet. Connect a stack to get started.
				</p>
			</CardContent>
		</Card>
	),
};

// ---------------------------------------------------------------------------
// Composed — realistic dashboard tile grid combining multiple slot patterns
// ---------------------------------------------------------------------------
export const Composed: Story = {
	render: () => (
		<div className="grid w-[860px] grid-cols-3 gap-4">
			{/* Stat card */}
			<Card>
				<CardHeader>
					<CardTitle>Cost Summary</CardTitle>
					<CardDescription>Last 24 hours</CardDescription>
					<CardAction>
						<span className="text-muted-foreground text-xs">vs yesterday</span>
					</CardAction>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold tabular-nums">$12.47</div>
					<p className="text-muted-foreground mt-1 text-sm">+8.3%</p>
				</CardContent>
			</Card>

			{/* Run summary card */}
			<Card>
				<CardHeader>
					<CardTitle>Production traces</CardTitle>
					<CardDescription>training_pipeline · 5 runs today</CardDescription>
					<CardAction>
						<IconButton
							variant="ghost"
							icon={<MoreHorizontal />}
							label="More options"
						/>
					</CardAction>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4 text-sm">
						<span className="font-mono text-xs font-medium tabular-nums">
							$0.0234
						</span>
						<span className="text-muted-foreground">2,481 tokens</span>
					</div>
				</CardContent>
				<CardFooter>
					<span className="text-muted-foreground text-xs">Last run 4m 12s</span>
				</CardFooter>
			</Card>

			{/* Actions card */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>Common operations</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<Button variant="outline" size="sm" className="w-full justify-start">
						<BarChart2 className="size-4" />
						New run
					</Button>
					<Button variant="outline" size="sm" className="w-full justify-start">
						<Search className="size-4" />
						Compare runs
					</Button>
				</CardContent>
			</Card>
		</div>
	),
};
