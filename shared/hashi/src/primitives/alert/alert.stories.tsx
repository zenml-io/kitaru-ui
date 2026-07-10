import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Loader2, Rocket } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "../button/button";

const meta: Meta<typeof Alert> = {
	title: "Primitives/Alert",
	component: Alert,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=380-1666",
		},
	},
	args: {
		variant: "default",
		emphasis: "light",
		shape: "inline",
	},
	argTypes: {
		variant: {
			control: "select",
			options: [
				"default",
				"neutral",
				"info",
				"success",
				"warning",
				"destructive",
			],
		},
		emphasis: {
			control: "select",
			options: ["light", "bold"],
		},
		shape: {
			control: "select",
			options: ["inline", "banner"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
	render: (args) => (
		<Alert {...args}>
			<AlertTitle>Workflow started</AlertTitle>
			<AlertDescription>
				The run is queued and will start as soon as a worker is available.
			</AlertDescription>
		</Alert>
	),
};

const intents = [
	"default",
	"neutral",
	"info",
	"success",
	"warning",
	"destructive",
] as const;

export const Variants: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			{intents.map((variant) => (
				<Alert key={variant} variant={variant} emphasis="light">
					<AlertTitle>{variant} alert</AlertTitle>
					<AlertDescription>
						This is a {variant} alert with the light emphasis.
					</AlertDescription>
				</Alert>
			))}
		</div>
	),
};

function EmphasisMatrix({ surface }: { surface?: string }) {
	return (
		<>
			{(["light", "bold"] as const).map((emphasis) => (
				<div key={emphasis} className="flex flex-col gap-2">
					<span className="text-muted-foreground text-xs">{emphasis}</span>
					<div className="flex flex-col gap-2">
						{intents.map((variant) => (
							<Alert key={variant} variant={variant} emphasis={emphasis}>
								<AlertTitle>{variant}</AlertTitle>
								<AlertDescription>
									Alert content rendered at {emphasis} emphasis
									{surface ? ` on a ${surface} surface` : ""}.
								</AlertDescription>
							</Alert>
						))}
					</div>
				</div>
			))}
		</>
	);
}

/**
 * Badge's `neutral` and `ghost` emphases are intentionally omitted for
 * Alert: `light` and `bold` cover every surface an alert needs, and the
 * extra axes would duplicate what `variant="neutral"` already provides.
 */
export const Emphasis: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<EmphasisMatrix />
		</div>
	),
};

/**
 * The full intent set inside a forced `.dark` surface, so dark-mode contrast
 * can be judged next to the light rendering without flipping the Mode
 * toolbar. The wrapper stands in for a dark app page.
 */
export const DarkMode: Story = {
	render: () => (
		<div className="dark bg-background flex flex-col gap-3 rounded-lg p-6">
			<EmphasisMatrix surface="dark" />
		</div>
	),
};

export const Icons: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<Alert variant="info">
				<AlertTitle>Auto icon</AlertTitle>
				<AlertDescription>
					No icon prop set, so the variant's default glyph is used.
				</AlertDescription>
			</Alert>
			<Alert variant="success" icon={<Rocket />}>
				<AlertTitle>Custom icon</AlertTitle>
				<AlertDescription>
					The icon prop overrides the variant's default glyph.
				</AlertDescription>
			</Alert>
			<Alert variant="neutral" icon={null}>
				<AlertTitle>No icon</AlertTitle>
				<AlertDescription>
					Passing null for the icon prop removes the icon span entirely.
				</AlertDescription>
			</Alert>
			<Alert variant="default" icon={<Loader2 className="animate-spin" />}>
				<AlertTitle>Deploying workspace</AlertTitle>
				<AlertDescription>
					A spinner icon communicates an in-progress state.
				</AlertDescription>
			</Alert>
		</div>
	),
};

/**
 * The dismiss contract is controlled: passing `onDismiss` renders the close
 * button, but the alert never removes itself. The parent owns visibility
 * and decides what happens when the button is pressed.
 */
export const Dismissible: Story = {
	render: function DismissibleExample() {
		const [visible, setVisible] = useState(true);

		if (!visible) {
			return (
				<Button variant="outline" size="sm" onClick={() => setVisible(true)}>
					Show alert
				</Button>
			);
		}

		return (
			<Alert variant="info" onDismiss={() => setVisible(false)}>
				<AlertTitle>New version available</AlertTitle>
				<AlertDescription>
					Update the CLI to pick up the latest fixes.
				</AlertDescription>
			</Alert>
		);
	},
};

/**
 * For more than one trailing control, pass a flex row as `action` rather
 * than stacking props: action and onDismiss render simultaneously and the
 * action slot has no opinion on how many children it holds.
 */
export const WithAction: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<Alert
				variant="warning"
				action={
					<Button size="sm" variant="outline">
						Retry
					</Button>
				}
			>
				<AlertTitle>Run failed to start</AlertTitle>
				<AlertDescription>
					The last attempt timed out while provisioning resources.
				</AlertDescription>
			</Alert>
			<Alert
				variant="destructive"
				action={
					<Button size="sm" variant="outline">
						View logs
					</Button>
				}
				onDismiss={() => {}}
			>
				<AlertTitle>Step failed</AlertTitle>
				<AlertDescription>
					The training step exited with a non-zero status code.
				</AlertDescription>
			</Alert>
		</div>
	),
};

export const Banner: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div className="bg-muted flex flex-col gap-4 p-0">
				<Alert
					variant="neutral"
					emphasis="bold"
					shape="banner"
					action={
						<div className="flex items-center gap-2">
							<Button size="sm" variant="ghost">
								Skip this version
							</Button>
							<Button size="sm" variant="default">
								Update
							</Button>
						</div>
					}
					onDismiss={() => {}}
				>
					<AlertTitle>ZenML 0.71 is available</AlertTitle>
					<AlertDescription>
						Update the workspace to get the latest features and fixes.
					</AlertDescription>
				</Alert>
				<div className="flex flex-col gap-2 p-4">
					<div className="bg-card h-4 w-1/3 rounded" />
					<div className="bg-card h-4 w-2/3 rounded" />
					<div className="bg-card h-4 w-1/2 rounded" />
				</div>
			</div>
			<Alert
				variant="warning"
				shape="banner"
				action={
					<Button size="sm" variant="outline">
						Retry
					</Button>
				}
			>
				<AlertTitle>Lost connection to the orchestrator</AlertTitle>
				<AlertDescription>
					Reconnect to resume live run status updates.
				</AlertDescription>
			</Alert>
		</div>
	),
};

/**
 * Narrow containers stay tidy: the content column keeps a minimum readable
 * measure (min-w-40), the action slot wraps onto its own row instead of
 * overflowing, and the dismiss button stays pinned to the top-right corner.
 */
export const Narrow: Story = {
	render: () => (
		<div className="flex w-80 flex-col gap-3">
			<Alert
				variant="warning"
				action={
					<Button size="sm" variant="outline">
						Upgrade workspace
					</Button>
				}
				onDismiss={() => {}}
			>
				<AlertTitle>Workspace version reaches end of support</AlertTitle>
				<AlertDescription>
					Upgrade before then to keep receiving security patches.
				</AlertDescription>
			</Alert>
			<Alert
				variant="neutral"
				emphasis="bold"
				shape="banner"
				action={
					<div className="flex items-center gap-2">
						<Button size="sm" variant="ghost">
							Skip this version
						</Button>
						<Button size="sm" variant="default">
							Update
						</Button>
					</div>
				}
				onDismiss={() => {}}
			>
				<AlertTitle>ZenML 0.71 is available</AlertTitle>
			</Alert>
		</div>
	),
};

export const Composed: Story = {
	render: function ComposedExample() {
		const [visible, setVisible] = useState(true);

		if (!visible) {
			return <></>;
		}

		return (
			<Alert
				variant="warning"
				action={
					<Button size="sm" variant="outline">
						Upgrade workspace
					</Button>
				}
				onDismiss={() => setVisible(false)}
			>
				<AlertTitle>
					Workspace version 0.68 reaches end of support on August 1
				</AlertTitle>
				<AlertDescription>
					Upgrade before then to keep receiving security patches for the
					workspace.
				</AlertDescription>
			</Alert>
		);
	},
};
