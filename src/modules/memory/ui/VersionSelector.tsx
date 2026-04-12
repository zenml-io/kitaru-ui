import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { ChevronDown } from "@untitledui/icons";
import { cn } from "@/shared/utils/styles";
import type { MemoryEntry } from "../domain/memory";
import { VersionListItem } from "./VersionListItem";

type VersionSelectorProps = {
	history: MemoryEntry[];
	selectedVersion?: string;
	currentVersion?: string;
	onSelectVersion: (version: string) => void;
};

export function VersionSelector({
	history,
	selectedVersion,
	currentVersion,
	onSelectVersion,
}: VersionSelectorProps) {
	const displayVersion = selectedVersion ?? currentVersion;
	const isLatestSelected =
		!selectedVersion || history[0]?.version === selectedVersion;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={cn(
					"text-muted-foreground hover:bg-accent hover:text-foreground flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs font-medium tabular-nums transition-colors"
				)}
			>
				v{displayVersion}
				{isLatestSelected && (
					<span className="text-primary text-2xs font-medium">latest</span>
				)}
				<ChevronDown className="size-3.5" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" sideOffset={4} className="w-60">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Version History</DropdownMenuLabel>
					{history.map((entry, index) => {
						const isLatest = index === 0;
						const isActive =
							entry.version === selectedVersion ||
							(!selectedVersion && isLatest);

						return (
							<DropdownMenuItem
								key={entry.artifactId}
								onClick={() => onSelectVersion(entry.version)}
								className={cn(
									"flex items-center gap-2.5 px-3 py-2.5",
									isActive && "bg-accent/30"
								)}
							>
								<VersionListItem entry={entry} isLatest={isLatest} />
							</DropdownMenuItem>
						);
					})}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
