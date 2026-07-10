import type { Meta, StoryObj } from "@storybook/react-vite";
import { Trash2, TriangleAlert } from "lucide-react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "../button/button";

const meta: Meta<typeof AlertDialog> = {
	title: "Primitives/AlertDialog",
	component: AlertDialog,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=360-1237",
		},
	},
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

/**
 * Trigger-driven, uncontrolled. The destructive action is the default-styled
 * pattern for confirming an irreversible operation.
 */
export const Default: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger
				render={<Button variant="destructive">Delete deployment</Button>}
			/>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete this deployment?</AlertDialogTitle>
					<AlertDialogDescription>
						Production traces will stop ingesting and historical runs become
						read-only. This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction variant="destructive">Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

/**
 * `defaultOpen` keeps the dialog mounted so it can be snapshotted without an
 * interaction step. Rendered in an iframe to avoid stacked backdrops on the
 * autodocs page.
 */
export const Open: Story = {
	parameters: {
		docs: {
			story: {
				inline: false,
				iframeHeight: 420,
			},
		},
	},
	render: () => (
		<AlertDialog defaultOpen>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Revoke API key?</AlertDialogTitle>
					<AlertDialogDescription>
						Any service authenticating with this key will lose access
						immediately. You can generate a replacement afterwards.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Keep key</AlertDialogCancel>
					<AlertDialogAction variant="destructive">Revoke</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

/**
 * `size="default"` (left-aligned, wider) versus `size="sm"` (centered, compact
 * with a two-column footer). Both shown open side by side.
 */
export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-start gap-4">
			<AlertDialog>
				<AlertDialogTrigger
					render={<Button variant="outline">Default size</Button>}
				/>
				<AlertDialogContent size="default">
					<AlertDialogHeader>
						<AlertDialogTitle>Disable workspace?</AlertDialogTitle>
						<AlertDialogDescription>
							Members of zenml-eu-central will be signed out and scheduled runs
							are paused until you re-enable it.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction>Disable</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog>
				<AlertDialogTrigger
					render={<Button variant="outline">Small size</Button>}
				/>
				<AlertDialogContent size="sm">
					<AlertDialogHeader>
						<AlertDialogTitle>Leave page?</AlertDialogTitle>
						<AlertDialogDescription>
							Unsaved changes to this pipeline config will be lost.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Stay</AlertDialogCancel>
						<AlertDialogAction>Leave</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	),
};

/**
 * `AlertDialogMedia` renders a leading icon slot. On the default size it floats
 * to the left of the title and description; on the small size it stacks and
 * centers.
 */
export const WithMedia: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger
				render={<Button variant="destructive">Delete secrets</Button>}
			/>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive">
						<TriangleAlert />
					</AlertDialogMedia>
					<AlertDialogTitle>Delete 3 secrets?</AlertDialogTitle>
					<AlertDialogDescription>
						These secrets are referenced by 2 active deployments. Removing them
						may break running flows. This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction variant="destructive">
						<Trash2 /> Delete secrets
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

/**
 * Action and cancel buttons accept any Button variant. Here the confirm action
 * is non-destructive (default variant) and the cancel keeps its outline style.
 */
export const NonDestructive: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger render={<Button>Publish version</Button>} />
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Publish v2.4.0 to production?</AlertDialogTitle>
					<AlertDialogDescription>
						The default tag will move from v2.3.1 to v2.4.0 and all incoming
						traffic will route to the new version.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Publish</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

/**
 * Long title and description exercise wrapping inside the constrained content
 * width.
 */
export const LongContent: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger
				render={<Button variant="destructive">Delete deployment</Button>}
			/>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Permanently delete the production-traces-eu-central deployment and
						all of its retained execution history?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This removes 1,284 stored runs, detaches 7 connected secrets, and
						revokes the deployment&apos;s service token. Downstream dashboards
						and scheduled exports that reference this deployment will start
						failing. We strongly recommend exporting any data you need before
						continuing, because this operation is irreversible and cannot be
						recovered from a backup.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction variant="destructive">
						Delete deployment
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

/**
 * Composed example: confirm a tag move between two deployment versions, mirroring
 * the real move-tag confirmation flow. Uses the small footer's two-column layout.
 */
export const Composed: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger
				render={<Button variant="outline">Move default tag</Button>}
			/>
			<AlertDialogContent>
				<AlertDialogHeader>
					<p className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
						Move default tag
					</p>
					<AlertDialogTitle>Route production to v2.4.0?</AlertDialogTitle>
					<AlertDialogDescription>
						zenml-eu-central will serve v2.4.0 to all production traffic. The
						tag currently points at v2.3.1.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="grid grid-cols-2 gap-3">
					<div className="border-border bg-muted/30 flex flex-col gap-1.5 rounded-md border p-3">
						<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
							From
						</span>
						<div className="flex items-baseline gap-2">
							<span className="text-foreground font-mono text-lg font-semibold">
								v2.3.1
							</span>
							<code className="text-muted-foreground font-mono text-xs">
								a1b2c3d
							</code>
						</div>
					</div>
					<div className="border-primary/40 bg-primary/5 flex flex-col gap-1.5 rounded-md border p-3">
						<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
							To
						</span>
						<div className="flex items-baseline gap-2">
							<span className="text-foreground font-mono text-lg font-semibold">
								v2.4.0
							</span>
							<code className="text-muted-foreground font-mono text-xs">
								9f8e7d6
							</code>
						</div>
					</div>
				</div>

				<AlertDialogFooter>
					<AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
					<AlertDialogAction size="sm">Move to v2.4.0</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};
