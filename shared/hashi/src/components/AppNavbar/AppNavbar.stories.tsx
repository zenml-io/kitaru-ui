import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLeft, Bell, Plus } from "lucide-react";

import { BrandMarkTile } from "@zenml/hashi/components/BrandMarkTile";
import { NavbarBrandSlot } from "@zenml/hashi/components/NavbarBrandSlot";
import { Avatar, AvatarFallback } from "@zenml/hashi/primitives/avatar";
import { Button } from "@zenml/hashi/primitives/button";
import { IconButton } from "@zenml/hashi/primitives/icon-button";

import { AppNavbar } from "./AppNavbar";

const meta: Meta<typeof AppNavbar> = {
	title: "Components/AppNavbar",
	component: AppNavbar,
	parameters: {
		layout: "fullscreen",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=301-915",
		},
	},
};

export default meta;
type Story = StoryObj<typeof AppNavbar>;

/**
 * The two-region shell: `leading` grows to fill space and truncates,
 * `trailing` stays fixed-width. Both regions are optional `ReactNode` slots,
 * so the Default uses plain text placeholders to show the layout skeleton.
 */
export const Default: Story = {
	args: {
		leading: (
			<span className="text-muted-foreground text-sm">leading region</span>
		),
		trailing: (
			<span className="text-muted-foreground text-sm">trailing region</span>
		),
	},
};

/**
 * Leading-only navbar (no trailing slot). Common on focused pages like
 * auth or a single-purpose detail view where there are no global actions.
 */
export const LeadingOnly: Story = {
	render: () => (
		<AppNavbar
			leading={
				<NavbarBrandSlot>
					<BrandMarkTile brand="zenml" />
				</NavbarBrandSlot>
			}
		/>
	),
};

/**
 * The canonical brand-slot pairing: `NavbarBrandSlot` hosts a `BrandMarkTile`
 * at the leftmost edge (it eats the navbar's `px-5` and adds the divider),
 * followed by a back button and the breadcrumb scope chain.
 */
export const WithBrandSlot: Story = {
	render: () => (
		<AppNavbar
			leading={
				<>
					<NavbarBrandSlot>
						<BrandMarkTile brand="kitaru" />
					</NavbarBrandSlot>
					<IconButton
						icon={<ArrowLeft className="size-4" />}
						label="Go back"
						variant="ghost"
						size="icon-sm"
					/>
					<span className="text-muted-foreground text-sm">
						zenml-eu-central / production-traces
					</span>
				</>
			}
			trailing={
				<span className="text-muted-foreground text-sm">actions · user</span>
			}
		/>
	),
};

/**
 * Both brand tiles side-by-side. The `BrandMarkTile` drives the navbar
 * wordmark/mark; the navbar chrome itself is brand-neutral and reads well in
 * both ZenML and Kitaru themes.
 */
export const Brands: Story = {
	parameters: {
		a11y: {
			config: {
				rules: [{ id: "landmark-unique", enabled: false }],
			},
		},
	},
	render: () => (
		<div className="flex flex-col">
			<AppNavbar
				leading={
					<NavbarBrandSlot>
						<BrandMarkTile brand="zenml" />
					</NavbarBrandSlot>
				}
				trailing={<span className="text-muted-foreground text-sm">ZenML</span>}
			/>
			<AppNavbar
				leading={
					<NavbarBrandSlot>
						<BrandMarkTile brand="kitaru" />
					</NavbarBrandSlot>
				}
				trailing={<span className="text-muted-foreground text-sm">Kitaru</span>}
			/>
		</div>
	),
};

/**
 * Long leading content stays inside its own region and applies its own
 * `truncate` class. The trailing region is fixed-width and unaffected by the
 * overflow — it never gets pushed off-screen.
 */
export const Truncation: Story = {
	render: () => (
		<AppNavbar
			leading={
				<span className="truncate text-sm">
					very-long-organization-name / very-long-workspace-name /
					very-long-project-name / very-long-pipeline-name / v1.2.3 / #exec_42
				</span>
			}
			trailing={<span className="text-muted-foreground text-sm">user</span>}
		/>
	),
};

/**
 * Empty navbar — no `leading` or `trailing` props. Renders the bare chrome
 * (height, border, background) so the shell is visible even with no content.
 */
export const Empty: Story = {
	render: () => <AppNavbar />,
};

/**
 * Realistic composed navbar: brand mark, back button, a workspace/project
 * scope chain in the leading region, and global actions plus a user avatar
 * in the trailing region — the shape consumers actually render in the app.
 */
export const Composed: Story = {
	render: () => (
		<AppNavbar
			leading={
				<>
					<NavbarBrandSlot>
						<BrandMarkTile brand="kitaru" />
					</NavbarBrandSlot>
					<IconButton
						icon={<ArrowLeft className="size-4" />}
						label="Go back"
						variant="ghost"
						size="icon-sm"
					/>
					<span className="truncate text-sm">
						<span className="text-foreground font-medium">
							zenml-eu-central
						</span>
						<span className="text-muted-foreground"> / production-traces</span>
					</span>
				</>
			}
			trailing={
				<>
					<Button size="sm">
						<Plus className="size-4" /> New run
					</Button>
					<IconButton
						icon={<Bell className="size-4" />}
						label="Notifications"
						variant="ghost"
						size="icon-sm"
					/>
					<Avatar size="sm" aria-label="User avatar">
						<AvatarFallback>AK</AvatarFallback>
					</Avatar>
				</>
			}
		/>
	),
};
