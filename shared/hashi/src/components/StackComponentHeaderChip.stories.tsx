import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	StackComponentHeaderChip,
	type StackComponentHeaderChipResource,
} from "./StackComponentHeaderChip";

// ─── Fixtures ─────────────────────────────────────────────────────────────────
// A neutral inline logo so the `logoUrl` branch renders offline (the img is
// decorative — aria-hidden with empty alt — so a blank load is harmless too).
const LOGO_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" rx="3"/></svg>'
)}`;

const ORCHESTRATOR: StackComponentHeaderChipResource = {
	name: "vertex-orchestrator",
	permissionDenied: false,
	type: "orchestrator",
	flavorName: "vertex",
	logoUrl: LOGO_URL,
};

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * A compact chip naming one component of a deployment's stack — orchestrator,
 * artifact store, container registry, and so on. It shows the flavor logo (when
 * present) and the flavor or component name, with a hover title carrying the
 * component type. When the viewer lacks access it falls back to a
 * `LockedResourceTag` instead of leaking the name.
 */
const meta: Meta<typeof StackComponentHeaderChip> = {
	title: "Components/StackComponentHeaderChip",
	component: StackComponentHeaderChip,
	args: {
		component: ORCHESTRATOR,
	},
	argTypes: {
		component: { control: false },
	},
};

export default meta;
type Story = StoryObj<typeof StackComponentHeaderChip>;

// ─── Default (with logo) ──────────────────────────────────────────────────────

export const Default: Story = {};

// ─── No logo ──────────────────────────────────────────────────────────────────
// Without a `logoUrl` the chip renders just the label, keeping the fixed height
// and border.

export const NoLogo: Story = {
	args: {
		component: {
			name: "s3-artifact-store",
			permissionDenied: false,
			type: "artifact_store",
			flavorName: "s3",
		},
	},
};

// ─── Name fallback ────────────────────────────────────────────────────────────
// When no `flavorName` is set, the chip shows the component `name` instead.

export const NameFallback: Story = {
	args: {
		component: {
			name: "prod-registry",
			permissionDenied: false,
			type: "container_registry",
		},
	},
};

// ─── Permission denied ────────────────────────────────────────────────────────
// An access-restricted component renders a LockedResourceTag rather than the
// resolved name.

export const PermissionDenied: Story = {
	args: {
		component: {
			name: "internal-gpu-orchestrator",
			permissionDenied: true,
			type: "orchestrator",
			flavorName: "kubernetes",
		},
	},
};

// ─── Composed: deployment stack row ───────────────────────────────────────────
// The chips as they appear in the deployment header's "Stack" row — a label
// followed by one chip per component, including one the viewer can't access.

export const Composed: Story = {
	render: () => (
		<div className="flex max-w-md flex-wrap items-center gap-2">
			<span className="text-muted-foreground shrink-0 text-xs font-semibold tracking-wider uppercase">
				Stack
			</span>
			{(
				[
					{
						name: "vertex-orchestrator",
						permissionDenied: false,
						type: "orchestrator",
						flavorName: "vertex",
						logoUrl: LOGO_URL,
					},
					{
						name: "gcs-artifact-store",
						permissionDenied: false,
						type: "artifact_store",
						flavorName: "gcp",
						logoUrl: LOGO_URL,
					},
					{
						name: "gcr-registry",
						permissionDenied: false,
						type: "container_registry",
						flavorName: "gcp",
					},
					{
						name: "secrets-manager",
						permissionDenied: true,
						type: "secrets_manager",
					},
				] as StackComponentHeaderChipResource[]
			).map((component) => (
				<StackComponentHeaderChip key={component.name} component={component} />
			))}
		</div>
	),
};
