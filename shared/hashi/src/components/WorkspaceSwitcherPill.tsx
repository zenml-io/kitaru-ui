import { SwitcherDropdownMenu } from "@zenml/hashi/components/SwitcherDropdownMenu";
import {
	SwitcherEmpty,
	SwitcherPill,
	SwitcherRow,
} from "@zenml/hashi/components/SwitcherPill";
import {
	getWorkspaceTypeLabel,
	type WorkspaceType,
} from "@zenml/hashi/lib/state-styles";
import { Badge } from "@zenml/hashi/primitives/badge";
import {
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@zenml/hashi/primitives/dropdown-menu";
import { ArrowLeft } from "lucide-react";
import type { ReactElement } from "react";

interface Item {
	name: string;
	slug: string;
	type: WorkspaceType;
	version: string;
}

interface WorkspaceSwitcherPillViewProps {
	items: Item[];
	selected: Item;
	labelRender: ReactElement;
	className?: string;
	onSelectWorkspace: (slug: string) => void;
	onBackToOrganization: () => void;
}

const GROUP_ORDER: WorkspaceType[] = ["zenml", "kitaru"];

type Section = {
	id: string;
	label?: string;
	items: Item[];
	separatorBefore?: boolean;
};

function matchesQuery(item: Item, query: string) {
	if (!query) return true;
	const hay = `${item.name} ${item.slug} ${item.version}`.toLowerCase();
	return hay.includes(query.toLowerCase());
}

function buildSections(items: Item[], query: string): Section[] {
	if (query) {
		const matches = items.filter((item) => matchesQuery(item, query));
		return matches.length ? [{ id: "search", items: matches }] : [];
	}

	// `separatorBefore` is computed AFTER filtering empty groups so the
	// first surviving section never carries an orphan separator (otherwise
	// an all-of-one-type set would render a stray divider above the first row).
	return GROUP_ORDER.map((type) => ({
		id: type,
		label: getWorkspaceTypeLabel(type),
		items: items.filter((item) => item.type === type),
		separatorBefore: false,
	}))
		.filter((section) => section.items.length > 0)
		.map((section, i) => ({ ...section, separatorBefore: i > 0 }));
}

export function WorkspaceSwitcherPillView({
	items,
	selected,
	labelRender,
	className,
	onSelectWorkspace,
	onBackToOrganization,
}: WorkspaceSwitcherPillViewProps) {
	return (
		<SwitcherPill
			className={className}
			labelRender={labelRender}
			labelAriaLabel={`Go to workspace ${selected.name}`}
			triggerAriaLabel={`Switch workspace. Current: ${selected.name}`}
			label={
				<span className="max-w-28 truncate md:max-w-44">{selected.name}</span>
			}
		>
			<SwitcherDropdownMenu
				contextLabel="Workspaces"
				footer={
					<DropdownMenuItem
						onClick={onBackToOrganization}
						className="text-muted-foreground m-1 flex items-center gap-2.5 py-1.5"
					>
						<ArrowLeft className="size-3.5" aria-hidden />
						<span className="text-sm">Back to organization</span>
					</DropdownMenuItem>
				}
			>
				{({ query }) => {
					const sections = buildSections(items, query);
					if (sections.length === 0) {
						return <SwitcherEmpty noun="workspaces" query={query} />;
					}

					return sections.map((section) => {
						return (
							<div key={section.id}>
								{section.separatorBefore && (
									<DropdownMenuSeparator className="my-1" />
								)}
								{section.label ? (
									<div className="text-2xs text-muted-foreground px-2 pt-1.5 pb-1 font-semibold tracking-wider uppercase">
										{section.label}
									</div>
								) : null}
								{section.items.map((item) => (
									<Row
										key={item.slug}
										item={item}
										isActive={item.slug === selected.slug}
										onSelect={() => onSelectWorkspace(item.slug)}
									/>
								))}
							</div>
						);
					});
				}}
			</SwitcherDropdownMenu>
		</SwitcherPill>
	);
}

function Row({
	item,
	isActive,
	onSelect,
}: {
	item: Item;
	isActive: boolean;
	onSelect: () => void;
}) {
	return (
		<SwitcherRow active={isActive} onSelect={onSelect}>
			<span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
				{item.name}
			</span>
			<Badge
				variant="outline"
				className="text-2xs h-4 shrink-0 px-1.5 font-mono"
			>
				{item.version}
			</Badge>
		</SwitcherRow>
	);
}
