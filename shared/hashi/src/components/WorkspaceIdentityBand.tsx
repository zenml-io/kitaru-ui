import type { ReactElement, ReactNode } from "react";
import { Check, Copy, ExternalLink, MoreHorizontal, Users } from "lucide-react";
import { Button } from "@zenml/hashi/primitives/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@zenml/hashi/primitives/dropdown-menu";
import { IconButton } from "@zenml/hashi/primitives/icon-button";
import { WorkspaceAvatar } from "@zenml/hashi/components/WorkspaceAvatar";
import { WorkspaceStatusDot } from "@zenml/hashi/components/WorkspaceStatusDot";
import { WorkspaceTypeVersionBadge } from "@zenml/hashi/components/WorkspaceTypeVersionBadge";
import {
	getWorkspaceStatusLabel,
	type WorkspaceStatus,
	type WorkspaceType,
} from "@zenml/hashi/lib/state-styles";
import { PageIdentityHeader } from "@zenml/hashi/components/PageIdentityHeader";

export interface WorkspaceSummary {
	id: string;
	slug: string;
	name: string;
	type: WorkspaceType;
	version: string;
	status: WorkspaceStatus;
	upgradeAvailable?: string;
	loginUrl?: string;
	apiUrl?: string;
}

export interface WorkspaceIdentityMember {
	id: string;
	name: string;
	email: string;
	initials: string;
	tintIndex: number;
	avatarUrl?: string;
}

interface WorkspaceIdentityBandProps {
	workspace: WorkspaceSummary;
	memberCount?: ReactNode;
	memberAvatars: ReactNode;
	cmdCopied: boolean;
	uuidCopied: boolean;
	urlCopied?: boolean;
	onCopyCommand: () => void;
	onCopyUuid: () => void;
	onCopyUrl?: () => void;
	manageMembersRender: ReactElement;
}

export function WorkspaceIdentityBand({
	workspace,
	memberCount,
	memberAvatars,
	cmdCopied,
	uuidCopied,
	urlCopied,
	onCopyCommand,
	onCopyUuid,
	onCopyUrl,
	manageMembersRender,
}: WorkspaceIdentityBandProps) {
	const loginCommand = `kitaru login ${workspace.loginUrl}`;

	return (
		<PageIdentityHeader
			avatar={<WorkspaceAvatar workspace={workspace} size="xl" />}
			pretitle="Workspace"
			title={workspace.name}
			meta={
				<>
					<WorkspaceTypeVersionBadge
						type={workspace.type}
						version={workspace.version}
					/>
					<span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
						<WorkspaceStatusDot status={workspace.status} />
						{getWorkspaceStatusLabel(workspace.status)}
					</span>
					<span className="text-muted-foreground inline-flex items-center gap-1 text-xs tabular-nums">
						<Users className="size-3" aria-hidden />
						{memberCount} members
					</span>
					{workspace.upgradeAvailable ? (
						<span className="text-primary inline-flex items-center gap-1 font-mono text-xs tabular-nums">
							↑ v{workspace.upgradeAvailable}
						</span>
					) : null}
				</>
			}
			actions={
				<>
					<div className="flex items-center gap-2">
						{memberAvatars}
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<IconButton
										icon={<MoreHorizontal className="size-4" />}
										label="Workspace actions"
										variant="ghost"
										size="icon-sm"
									/>
								}
							/>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem render={manageMembersRender}>
									<Users className="size-4" aria-hidden />
									Manage Members
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem closeOnClick={false} onClick={onCopyUuid}>
									{uuidCopied ? (
										<Check className="text-success size-4" aria-hidden />
									) : (
										<Copy className="size-4" aria-hidden />
									)}
									{uuidCopied ? "Copied" : "Copy UUID"}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<div className="bg-muted text-foreground inline-flex h-8 items-center gap-1.5 rounded-md pr-1 pl-2.5 font-mono text-xs">
							<span className="max-w-3xs truncate">{loginCommand}</span>
							<IconButton
								icon={
									cmdCopied ? (
										<Check className="text-success size-3.5" />
									) : (
										<Copy className="size-3.5" />
									)
								}
								label={cmdCopied ? "Copied" : "Copy login command"}
								variant="ghost"
								size="icon-xs"
								onClick={onCopyCommand}
							/>
						</div>
						{workspace.loginUrl ? (
							<Button variant="outline" size="sm" onClick={onCopyUrl}>
								{urlCopied ? (
									<Check className="text-success size-3.5" />
								) : (
									<Copy className="size-3.5" />
								)}
								{urlCopied ? "Copied" : "URL"}
							</Button>
						) : null}
						{workspace.apiUrl ? (
							<Button
								variant="outline"
								size="sm"
								render={
									<a
										href={workspace.apiUrl}
										target="_blank"
										rel="noopener noreferrer"
									/>
								}
							>
								<ExternalLink className="size-3.5" />
								API
							</Button>
						) : null}
					</div>
				</>
			}
		/>
	);
}
