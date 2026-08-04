import type { ReactElement, ReactNode } from "react";
import { Check, Copy, MoreHorizontal, Package, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@zenml/hashi/primitives/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@zenml/hashi/primitives/dropdown-menu";
import { IconButton } from "@zenml/hashi/primitives/icon-button";
import { PageIdentityHeader } from "@zenml/hashi/components/PageIdentityHeader";

interface ProjectIdentityBandViewProps {
	name: string;
	memberAvatars: ReactNode;
	copied: boolean;
	onCopyProjectId: () => void;
	manageMembersRender: ReactElement;
}

export function ProjectIdentityBandView({
	name,
	memberAvatars,
	copied,
	onCopyProjectId,
	manageMembersRender,
}: ProjectIdentityBandViewProps) {
	return (
		<PageIdentityHeader
			avatar={
				<Avatar shape="square" size="xl">
					<AvatarFallback className="bg-muted text-muted-foreground">
						<Package className="size-5" aria-hidden />
					</AvatarFallback>
				</Avatar>
			}
			pretitle="Project"
			title={name}
			actions={
				<div className="flex items-center gap-2">
					{memberAvatars}
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<IconButton
									icon={<MoreHorizontal className="size-4" />}
									label="Project actions"
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
							<DropdownMenuItem closeOnClick={false} onClick={onCopyProjectId}>
								{copied ? (
									<Check className="text-success size-4" aria-hidden />
								) : (
									<Copy className="size-4" aria-hidden />
								)}
								{copied ? "Copied" : "Copy project ID"}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			}
		/>
	);
}
