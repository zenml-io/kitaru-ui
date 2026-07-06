import type { ReactElement } from "react";
import { FolderTree } from "lucide-react";
import { DropdownMenuItem } from "@zenml/hashi/primitives/dropdown-menu";
import { SwitcherDropdownMenu } from "@zenml/hashi/components/SwitcherDropdownMenu";
import {
	SwitcherEmpty,
	SwitcherPill,
	SwitcherRow,
} from "@zenml/hashi/components/SwitcherPill";

interface Item {
	slug: string;
	name: string;
}

interface ProjectSwitcherPillViewProps {
	items: Item[];
	selected: Item;
	labelRender: ReactElement;
	className?: string;
	onSelectProject: (slug: string) => void;
	onOpenAllProjects: () => void;
}

export function ProjectSwitcherPillView({
	items,
	selected,
	labelRender,
	className,
	onSelectProject,
	onOpenAllProjects,
}: ProjectSwitcherPillViewProps) {
	return (
		<SwitcherPill
			className={className}
			labelRender={labelRender}
			labelAriaLabel={`Go to project ${selected.name}`}
			triggerAriaLabel={`Switch project. Current: ${selected.name}`}
			label={
				<span className="max-w-28 truncate md:max-w-44">{selected.name}</span>
			}
		>
			<SwitcherDropdownMenu
				contextLabel="Projects"
				footer={
					<DropdownMenuItem
						onClick={onOpenAllProjects}
						className="text-muted-foreground m-1 flex items-center gap-2.5 py-1.5"
					>
						<FolderTree className="size-3.5" aria-hidden />
						<span className="text-sm">All projects</span>
					</DropdownMenuItem>
				}
			>
				{({ query }) => {
					const q = query.toLowerCase();
					const filtered = q
						? items.filter((project) =>
								`${project.name} ${project.slug}`.toLowerCase().includes(q)
							)
						: items;
					if (filtered.length === 0) {
						return <SwitcherEmpty noun="projects" query={query} />;
					}
					return filtered.map((project) => {
						const isActive = project.slug === selected.slug;
						return (
							<SwitcherRow
								key={project.slug}
								active={isActive}
								onSelect={() => onSelectProject(project.slug)}
							>
								<span className="text-foreground min-w-0 flex-1 truncate text-sm">
									{project.name}
								</span>
							</SwitcherRow>
						);
					});
				}}
			</SwitcherDropdownMenu>
		</SwitcherPill>
	);
}
