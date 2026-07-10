import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Cloud,
	Columns3,
	Copy,
	Ellipsis,
	GitBranch,
	LogOut,
	Pencil,
	RotateCcw,
	Settings,
	Trash2,
	UserPlus,
} from "lucide-react";

import { Button } from "../button/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./dropdown-menu";

const meta: Meta<typeof DropdownMenuContent> = {
	title: "Primitives/DropdownMenu",
	component: DropdownMenuContent,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=84-5",
		},
	},
};

export default meta;
type Story = StoryObj<typeof DropdownMenuContent>;

// Default: a minimal trigger-based menu with a few plain items.
export const Default: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				Open menu
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[180px]">
				<DropdownMenuItem>View details</DropdownMenuItem>
				<DropdownMenuItem>Duplicate</DropdownMenuItem>
				<DropdownMenuItem>Rename</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

// The single always-open story: the richest representative menu, rendered
// open so the popup is captured. Kept non-inline (its own iframe) so the
// portalled popup doesn't overlap the autodocs prose; every other story is
// trigger-driven to avoid stacking ~11 open menus on the docs page.
export const Open: Story = {
	parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
	render: () => (
		<DropdownMenu defaultOpen>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				Actions
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[200px]">
				{/* DropdownMenuLabel is a Base UI GroupLabel — it must live inside
				    a DropdownMenuGroup. */}
				<DropdownMenuGroup>
					<DropdownMenuLabel>Run #418</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<RotateCcw />
						Re-run pipeline
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Copy />
						Copy run ID
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					<Trash2 />
					Delete run
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

// Items with leading icons. The shared `[&_svg]` styles tint and size them.
export const WithIcons: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				Pipeline
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[200px]">
				<DropdownMenuItem>
					<RotateCcw />
					Re-run
				</DropdownMenuItem>
				<DropdownMenuItem>
					<GitBranch />
					Compare runs
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Cloud />
					View in stack
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings />
					Configure
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

// Keyboard-shortcut hints aligned to the trailing edge via DropdownMenuShortcut.
export const WithShortcuts: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				Edit
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[220px]">
				<DropdownMenuItem>
					<Pencil />
					Rename
					<DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Copy />
					Duplicate
					<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					<Trash2 />
					Delete
					<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

// Default vs destructive item variants.
export const ItemVariants: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				Item variants
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[200px]">
				<DropdownMenuItem>Default item</DropdownMenuItem>
				<DropdownMenuItem variant="destructive">
					Destructive item
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem disabled>Disabled item</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

// Labels, groups and separators structure the menu into named sections.
export const GroupsAndLabels: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				Workspace
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[220px]">
				<DropdownMenuGroup>
					<DropdownMenuLabel>zenml-eu-central</DropdownMenuLabel>
					<DropdownMenuItem>
						<Settings />
						Workspace settings
					</DropdownMenuItem>
					<DropdownMenuItem>
						<UserPlus />
						Invite members
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel>Account</DropdownMenuLabel>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>
						<LogOut />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

// Inset items align their text past the icon gutter, lining up with icon rows.
export const InsetItems: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				Inset alignment
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[200px]">
				<DropdownMenuGroup>
					<DropdownMenuLabel inset>View</DropdownMenuLabel>
					<DropdownMenuItem>
						<Columns3 />
						Table
					</DropdownMenuItem>
					<DropdownMenuItem inset>Compact</DropdownMenuItem>
					<DropdownMenuItem inset>Comfortable</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

// Checkbox items for multi-select toggles (e.g. column visibility).
export const CheckboxItems: Story = {
	render: function CheckboxItemsStory() {
		const [visible, setVisible] = React.useState<Set<string>>(
			new Set(["status", "duration", "cost"])
		);
		const toggle = (key: string) =>
			setVisible((prev) => {
				const next = new Set(prev);
				if (next.has(key)) {
					next.delete(key);
				} else {
					next.add(key);
				}
				return next;
			});
		const columns = [
			{ key: "status", label: "Status" },
			{ key: "duration", label: "Duration" },
			{ key: "cost", label: "Cost" },
			{ key: "tokens", label: "Tokens" },
			{ key: "stack", label: "Stack" },
		];
		return (
			<DropdownMenu>
				<DropdownMenuTrigger render={<Button variant="outline" />}>
					<Columns3 className="size-3.5" />
					Columns
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-[180px]">
					{columns.map((col) => (
						<DropdownMenuCheckboxItem
							key={col.key}
							checked={visible.has(col.key)}
							onCheckedChange={() => toggle(col.key)}
						>
							{col.label}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	},
};

// Radio group for a single-select choice (e.g. default branch).
export const RadioItems: Story = {
	render: function RadioItemsStory() {
		const [branch, setBranch] = React.useState("main");
		return (
			<DropdownMenu>
				<DropdownMenuTrigger render={<Button variant="outline" />}>
					<GitBranch className="size-3.5" />
					Branch
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-[200px]">
					{/* GroupLabel needs a Menu.Group ancestor; RadioGroup alone does
					    not provide that context. */}
					<DropdownMenuGroup>
						<DropdownMenuLabel>Default branch</DropdownMenuLabel>
						<DropdownMenuRadioGroup value={branch} onValueChange={setBranch}>
							<DropdownMenuRadioItem value="main">main</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="staging">
								staging
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="develop">
								develop
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	},
};

// Submenu nesting via DropdownMenuSub.
export const WithSubmenu: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				Run #418
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[200px]">
				<DropdownMenuItem>
					<RotateCcw />
					Re-run
				</DropdownMenuItem>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Cloud />
						Run on stack
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>zenml-eu-central</DropdownMenuItem>
						<DropdownMenuItem>zenml-us-east</DropdownMenuItem>
						<DropdownMenuItem>local-default</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					<Trash2 />
					Delete run
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

// Alignment of the popup relative to its trigger.
export const Alignment: Story = {
	render: () => (
		<div className="flex flex-wrap items-start gap-3">
			{(["start", "center", "end"] as const).map((align) => (
				<DropdownMenu key={align}>
					<DropdownMenuTrigger render={<Button variant="outline" />}>
						align={align}
					</DropdownMenuTrigger>
					<DropdownMenuContent align={align} className="w-[160px]">
						<DropdownMenuItem>First action</DropdownMenuItem>
						<DropdownMenuItem>Second action</DropdownMenuItem>
						<DropdownMenuItem>Third action</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			))}
		</div>
	),
};

// Long item labels truncate inside a constrained content width.
export const LongLabels: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				Long labels
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[200px]">
				<DropdownMenuItem>
					<span className="truncate">
						feature_engineering_pipeline_v2_experimental
					</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<span className="truncate">
						zenml-eu-central-production-cluster-01
					</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<span className="truncate">
						claude-sonnet-4-5-20250929-extended-thinking
					</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

// Realistic: a table row-actions menu opened from a ghost icon button —
// mirrors the production RowActions component.
export const RowActionsMenu: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={<Button variant="ghost" size="icon" aria-label="Row actions" />}
			>
				<Ellipsis className="size-4" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[180px]">
				<DropdownMenuItem>
					<RotateCcw />
					Re-run
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Copy />
					Copy execution ID
				</DropdownMenuItem>
				<DropdownMenuItem>
					<GitBranch />
					Compare with previous
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					<Trash2 />
					Delete execution
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};
