import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	BarChart2,
	CircleCheck,
	Clock,
	FileJson,
	Info,
	Tag,
	TriangleAlert,
	Zap,
} from "lucide-react";

import { Badge } from "./badge";
import { ColorDot } from "../color-dot/color-dot";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip/tooltip";

const meta: Meta<typeof Badge> = {
	title: "Primitives/Badge",
	component: Badge,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=61-11",
		},
	},
	args: {
		children: "Badge",
		variant: "default",
		emphasis: "bold",
		radius: "full",
		size: "default",
	},
	argTypes: {
		variant: {
			control: "select",
			options: [
				"default",
				"secondary",
				"destructive",
				"outline",
				"ghost",
				"link",
				"success",
				"warning",
				"info",
				"teal",
				"neutral",
				"archived",
			],
		},
		emphasis: {
			control: "select",
			options: ["bold", "light", "neutral", "ghost"],
		},
		radius: {
			control: "select",
			options: ["full", "sm"],
		},
		size: {
			control: "select",
			options: ["default", "xs"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Badge>Default</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="outline">Outline</Badge>
			<Badge variant="ghost">Ghost</Badge>
			<Badge variant="destructive">Destructive</Badge>
			<Badge variant="link">Link</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="info">Info</Badge>
			<Badge variant="teal">Teal</Badge>
			<Badge variant="neutral">Neutral</Badge>
			<Badge variant="archived">Archived</Badge>
		</div>
	),
};

const colorVariants = [
	"default",
	"destructive",
	"success",
	"warning",
	"info",
	"teal",
	"neutral",
	"archived",
] as const;

/**
 * The `emphasis` axis restyles every color-bearing variant: `bold` keeps the
 * solid fill, `light` is a tinted fill with colored text, `neutral` is the
 * shared secondary fill with colored text, and `ghost` drops the fill
 * entirely. Emphasis is a documented no-op on `secondary`, `outline`,
 * `ghost`, and `link`.
 */
export const Emphasis: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			{(["bold", "light", "neutral", "ghost"] as const).map((emphasis) => (
				<div key={emphasis} className="flex flex-wrap items-center gap-3">
					<span className="text-muted-foreground w-14 shrink-0 text-xs">
						{emphasis}
					</span>
					{colorVariants.map((variant) => (
						<Badge key={variant} variant={variant} emphasis={emphasis}>
							{variant}
						</Badge>
					))}
				</div>
			))}
		</div>
	),
};

export const WithIcon: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Badge variant="success">
				<CircleCheck />
				Completed
			</Badge>
			<Badge variant="secondary">
				<BarChart2 />
				Running
			</Badge>
			<Badge variant="outline">
				<Clock />
				Queued
			</Badge>
			<Badge variant="destructive">
				<Zap />
				Failed
			</Badge>
			<Badge variant="warning">
				<TriangleAlert />
				Degraded
			</Badge>
			<Badge variant="info">
				<Info />
				Initializing
			</Badge>
		</div>
	),
};

/**
 * Badge accepts a `render` prop to swap the underlying element while keeping
 * all variant styles. Use `render={<a />}` for navigation and
 * `render={<button type="button" />}` for interactive filter chips.
 */
export const AsLink: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Badge render={<a href="#" />} variant="outline">
				zenml-io/zenml
			</Badge>
			<Badge render={<a href="#" />} variant="default">
				v0.70.0
			</Badge>
			<Badge render={<a href="#" />} variant="link">
				View changelog
			</Badge>
		</div>
	),
};

/**
 * Badges used as toggle chips — e.g. artifact type filters or tag selectors.
 * The `render={<button />}` swap gives the badge a native button role while
 * keeping all visual variants.
 */
export const AsButton: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Badge
				render={<button type="button" />}
				variant="default"
				className="cursor-pointer"
				aria-pressed="true"
			>
				<FileJson />
				config.json
			</Badge>
			<Badge
				render={<button type="button" />}
				variant="outline"
				className="cursor-pointer"
				aria-pressed="false"
			>
				<FileJson />
				model_weights.pkl
			</Badge>
			<Badge
				render={<button type="button" />}
				variant="outline"
				className="cursor-pointer"
				aria-pressed="false"
			>
				<FileJson />
				evaluation_report.json
			</Badge>
		</div>
	),
};

/**
 * Realistic composition: pipeline run metadata row showing status, trigger
 * source, and environment tags as a single inline cluster of badges.
 */
export const Composed: Story = {
	render: () => (
		<div className="border-border bg-card flex flex-col gap-4 rounded-lg border p-4">
			<div className="flex items-center gap-2">
				<span className="text-foreground text-sm font-medium">
					training_pipeline · run #1482
				</span>
				<Badge variant="success">
					<CircleCheck />
					Completed
				</Badge>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<Badge variant="outline">
					<Clock />
					Scheduled
				</Badge>
				<Badge variant="secondary">zenml-eu-central</Badge>
				<Badge variant="secondary">
					<Tag />
					v2.4.1
				</Badge>
				<Badge variant="info">
					<Info />
					staging
				</Badge>
			</div>
		</div>
	),
};

/**
 * The three product badge recipes, composed from the axes plus call-site
 * typography: uppercase status chips (`emphasis="light"`), mono delta
 * chips (`emphasis="light"`), and a dot+label deployment chip
 * (`emphasis="neutral"`) using `ColorDot`.
 */
export const StatusRecipes: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center gap-2">
				<Badge
					variant="teal"
					emphasis="light"
					radius="sm"
					size="xs"
					className="font-semibold tracking-wider uppercase"
				>
					initializing
				</Badge>
				<Badge
					variant="warning"
					emphasis="light"
					radius="sm"
					size="xs"
					className="font-semibold tracking-wider uppercase"
				>
					running
				</Badge>
				<Badge
					variant="success"
					emphasis="light"
					radius="sm"
					size="xs"
					className="font-semibold tracking-wider uppercase"
				>
					completed
				</Badge>
				<Badge
					variant="destructive"
					emphasis="light"
					radius="sm"
					size="xs"
					className="font-semibold tracking-wider uppercase"
				>
					failed
				</Badge>
				<Badge
					variant="neutral"
					emphasis="light"
					radius="sm"
					size="xs"
					className="font-semibold tracking-wider uppercase"
				>
					cached
				</Badge>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<Badge
					variant="success"
					emphasis="light"
					radius="sm"
					size="xs"
					className="px-1.5 font-mono font-semibold tabular-nums"
				>
					-4%
				</Badge>
				<Badge
					variant="destructive"
					emphasis="light"
					radius="sm"
					size="xs"
					className="px-1.5 font-mono font-semibold tabular-nums"
				>
					+12%
				</Badge>
				<Badge
					variant="neutral"
					emphasis="light"
					radius="sm"
					size="xs"
					className="px-1.5 font-mono font-semibold tabular-nums"
				>
					0%
				</Badge>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<Badge
					variant="success"
					emphasis="neutral"
					radius="sm"
					size="xs"
					className="gap-1.5 font-semibold tracking-wider uppercase"
				>
					<ColorDot shape="round" size="xs" className="bg-success" />
					running
				</Badge>
				<Badge
					variant="archived"
					emphasis="neutral"
					radius="sm"
					size="xs"
					className="gap-1.5 font-semibold tracking-wider uppercase"
				>
					<ColorDot shape="round" size="xs" className="bg-status-archived" />
					archived
				</Badge>
			</div>
		</div>
	),
};

/**
 * Truncation recipe for user-supplied labels: cap the badge with `max-w-[...]`
 * and put `truncate` on an inner span — the badge itself is a flex container,
 * so `truncate` directly on it clips without an ellipsis. Wrap in a Tooltip so
 * the full label stays reachable on hover/focus.
 */
export const LongText: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Tooltip>
				<TooltipTrigger render={<Badge variant="outline" className="max-w-40" />}>
					<span className="truncate">
						feature/very-long-branch-name-that-should-be-truncated
					</span>
				</TooltipTrigger>
				<TooltipContent>
					feature/very-long-branch-name-that-should-be-truncated
				</TooltipContent>
			</Tooltip>
			<Badge variant="secondary">normal-length-label</Badge>
		</div>
	),
};
