import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	formatVersion,
	LOCAL_VERSION_ID,
	type Deployment,
	type DeploymentTag,
	type DeploymentVersion,
} from "../domain/deployment";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/utils/styles";
import { DeploymentTagChip } from "./DeploymentTagChip";

type SortOrder = "newest" | "oldest";

const TAG_PRIORITY: Record<DeploymentTag["kind"], number> = {
	default: 0,
	exclusive: 1,
	general: 2,
};

function sortedTags(d: Deployment) {
	return [...d.tags].sort(
		(a, b) => TAG_PRIORITY[a.kind] - TAG_PRIORITY[b.kind]
	);
}

function deploymentTime(d: Deployment): number {
	return d.createdAt?.getTime() ?? 0;
}

function formatDate(d: Date | undefined): string {
	if (!d) return "";
	return d.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

type DeploymentVersionSwitcherPillProps = {
	selected: Deployment;
	selectedDefaultTag: DeploymentTag | undefined;
	defaultHolder: Deployment | undefined;
	restRealVersions: Deployment[];
	localEntry: Deployment | undefined;
	onSelect: (selection: DeploymentVersion) => void;
	className?: string;
};

export function DeploymentVersionSwitcherPill({
	selected,
	selectedDefaultTag,
	defaultHolder,
	restRealVersions,
	localEntry,
	onSelect,
	className,
}: DeploymentVersionSwitcherPillProps) {
	const [sort, setSort] = useState<SortOrder>("newest");

	const dir = sort === "newest" ? -1 : 1;
	const sortedRealVersions = [...restRealVersions].sort(
		(a, b) => dir * (deploymentTime(a) - deploymentTime(b))
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button
						type="button"
						aria-label={`Switch version. Current: ${formatVersion(selected.version)}`}
						className={cn(
							"inline-flex h-7 items-center gap-1.5 rounded-md px-2",
							"hover:bg-accent/60 focus-visible:ring-ring/40 transition-colors focus-visible:ring-2 focus-visible:outline-none",
							"data-[popup-open]:bg-accent/70",
							className
						)}
					>
						<span className="text-foreground font-mono text-sm font-semibold">
							{formatVersion(selected.version)}
						</span>
						{selectedDefaultTag && (
							<DeploymentTagChip tag={selectedDefaultTag} size="sm" />
						)}
						<ChevronsUpDown
							className="text-muted-foreground size-3 shrink-0"
							aria-hidden
						/>
					</button>
				}
			/>
			<DropdownMenuContent
				align="start"
				sideOffset={6}
				className="w-[420px] p-0"
			>
				<div className="flex flex-col">
					<div className="border-border flex items-center justify-end border-b px-3 py-2">
						<Select value={sort} onValueChange={(v) => setSort(v as SortOrder)}>
							<SelectTrigger
								size="sm"
								className="h-7 w-[120px] text-xs"
								aria-label="Sort order"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">Newest</SelectItem>
								<SelectItem value="oldest">Oldest</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="max-h-[420px] overflow-y-auto">
						{defaultHolder && (
							<>
								<div className="text-muted-foreground text-2xs px-3 pt-2.5 pb-1 font-semibold tracking-wider uppercase">
									Current default
								</div>
								<VersionRow
									deployment={defaultHolder}
									isSelected={selected.id === defaultHolder.id}
									onSelect={() => onSelect(defaultHolder.version)}
								/>
								<div className="border-border border-b" />
							</>
						)}

						{(sortedRealVersions.length > 0 || defaultHolder) && (
							<div className="text-muted-foreground text-2xs flex items-center gap-1.5 px-3 pt-2.5 pb-1 font-semibold tracking-wider uppercase">
								<span>All versions</span>
								<span aria-hidden>·</span>
								<span className="tabular-nums">
									{sortedRealVersions.length}
								</span>
							</div>
						)}
						{sortedRealVersions.map((d) => (
							<VersionRow
								key={d.id}
								deployment={d}
								isSelected={selected.id === d.id}
								onSelect={() => onSelect(d.version)}
							/>
						))}
						{localEntry && (
							<>
								<div className="border-border border-b" />
								<div className="text-muted-foreground text-2xs px-3 pt-2.5 pb-1 font-semibold tracking-wider uppercase">
									Unversioned
								</div>
								<VersionRow
									deployment={localEntry}
									isSelected={selected.id === localEntry.id}
									onSelect={() => onSelect(LOCAL_VERSION_ID)}
								/>
							</>
						)}
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

const VISIBLE_TAGS = 2;

function VersionRow({
	deployment,
	isSelected,
	onSelect,
}: {
	deployment: Deployment;
	isSelected: boolean;
	onSelect: () => void;
}) {
	if (deployment.version === LOCAL_VERSION_ID) {
		return (
			<button
				type="button"
				onClick={onSelect}
				className={cn(
					"flex w-full items-center gap-3 px-3 py-2 text-left",
					"hover:bg-accent/40 focus-visible:bg-accent/40 focus-visible:outline-none",
					isSelected && "bg-primary/5 hover:bg-primary/5"
				)}
			>
				<div className="flex w-4 shrink-0 justify-center">
					{isSelected ? (
						<Check
							className="text-primary size-4"
							aria-label="Currently viewing"
						/>
					) : (
						<span aria-hidden className="block size-4" />
					)}
				</div>
				<span className="text-foreground min-w-[32px] shrink-0 font-mono text-sm font-semibold">
					local
				</span>
				<div className="flex min-w-0 flex-1 items-center gap-1">
					<span className="text-2xs text-muted-foreground italic">
						not deployed
					</span>
				</div>
			</button>
		);
	}

	const tags = sortedTags(deployment);
	const visibleTags = tags.slice(0, VISIBLE_TAGS);
	const overflowTags = tags.slice(VISIBLE_TAGS);

	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				"flex w-full items-center gap-3 px-3 py-2 text-left",
				"hover:bg-accent/40 focus-visible:bg-accent/40 focus-visible:outline-none",
				isSelected && "bg-primary/5 hover:bg-primary/5"
			)}
		>
			<div className="flex w-4 shrink-0 justify-center">
				{isSelected ? (
					<Check
						className="text-primary size-4"
						aria-label="Currently viewing"
					/>
				) : (
					<span aria-hidden className="block size-4" />
				)}
			</div>

			<span className="text-foreground min-w-[32px] shrink-0 font-mono text-sm font-semibold">
				{formatVersion(deployment.version)}
			</span>

			<div className="flex min-w-0 flex-1 items-center gap-1">
				{tags.length === 0 ? (
					<span className="text-2xs text-muted-foreground italic">no tags</span>
				) : (
					<>
						{visibleTags.map((t) => (
							<DeploymentTagChip key={t.id} tag={t} size="sm" />
						))}
						{overflowTags.length > 0 && (
							<span
								className="bg-muted text-2xs text-muted-foreground inline-flex h-5 items-center rounded px-1.5 font-mono tracking-wider uppercase"
								title={overflowTags.map((t) => t.name).join(", ")}
							>
								+{overflowTags.length}
							</span>
						)}
					</>
				)}
			</div>

			<span className="text-2xs text-muted-foreground shrink-0 tabular-nums">
				{formatDate(deployment.createdAt)}
			</span>
		</button>
	);
}
