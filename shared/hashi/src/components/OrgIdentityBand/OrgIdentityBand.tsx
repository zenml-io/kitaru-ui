import { Box, LayoutGrid, Users } from "lucide-react";
import { OrgMark } from "@zenml/hashi/components/OrgMark";
import { PageIdentityHeader } from "@zenml/hashi/components/PageIdentityHeader";

interface OrgIdentityBandProps {
	name: string;
	workspaceCount: number;
	projectCount: number;
	memberCount: number;
}

// Matches Paper artboard 4E6-0 — squared org image, name, "Organization" pill,
// then three stat slots on the right (workspaces / projects / members).
// Page-level actions (New workspace, etc.) live in the global navbar so the
// identity band stays informational.
//
// Atomic primitive (no wired sibling in src/components/layout/) — per
// CONVENTIONS-MODULES.md, no `*View` suffix.
export function OrgIdentityBand({
	name,
	workspaceCount,
	projectCount,
	memberCount,
}: OrgIdentityBandProps) {
	return (
		<PageIdentityHeader
			avatar={
				<OrgMark name={name} imageSrc="/zenml-org-example.png" size="xl" />
			}
			pretitle="Organization"
			title={name}
			actions={
				<div className="flex items-center gap-5 text-xs">
					<OrgStat
						icon={<LayoutGrid className="size-3.5" aria-hidden />}
						label="Workspaces"
						value={workspaceCount}
					/>
					<OrgStat
						icon={<Box className="size-3.5" aria-hidden />}
						label="Projects"
						value={projectCount}
					/>
					<OrgStat
						icon={<Users className="size-3.5" aria-hidden />}
						label="Members"
						value={memberCount}
					/>
				</div>
			}
		/>
	);
}

function OrgStat({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: number;
}) {
	return (
		<div className="flex flex-col items-end gap-0.5">
			<span className="text-muted-foreground text-2xs font-semibold tracking-[0.5px] uppercase">
				{label}
			</span>
			<span className="text-foreground inline-flex items-center gap-1 text-sm font-semibold tabular-nums">
				{icon}
				{value}
			</span>
		</div>
	);
}
