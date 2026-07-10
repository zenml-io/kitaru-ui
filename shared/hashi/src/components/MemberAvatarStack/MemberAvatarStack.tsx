import { getMemberTintClass } from "@zenml/hashi/lib/state-styles";
import { cn } from "@zenml/hashi/lib/utils";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "@zenml/hashi/primitives/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@zenml/hashi/primitives/tooltip";
import { type WorkspaceIdentityMember } from "../WorkspaceIdentityBand/WorkspaceIdentityBand";

interface MemberAvatarStackProps {
	members: WorkspaceIdentityMember[];
	/** Max avatars shown before collapsing into +N. Default 4. */
	max?: number;
	/** Proxied to shadcn Avatar. Default "sm". */
	size?: "sm" | "default";
	className?: string;
}

export function MemberAvatarStack({
	members,
	max = 4,
	size = "sm",
	className,
}: MemberAvatarStackProps) {
	if (members.length === 0) return null;
	const visible = members.slice(0, max);
	const overflow = members.slice(max);
	return (
		<TooltipProvider>
			<AvatarGroup className={cn("-space-x-1", className)}>
				{visible.map((m) => (
					<Tooltip key={m.id}>
						<TooltipTrigger>
							<Avatar size={size} className="ring-background ring-2">
								<AvatarImage src={m.avatarUrl} alt={m.name} />
								<AvatarFallback
									className={cn(
										"text-2xs font-semibold",
										getMemberTintClass(m.tintIndex)
									)}
								>
									{m.initials.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<div className="text-xs font-semibold">{m.name}</div>
							<div className="text-background/70 text-xs">{m.email}</div>
						</TooltipContent>
					</Tooltip>
				))}
				{overflow.length > 0 ? (
					<Tooltip>
						<TooltipTrigger>
							<AvatarGroupCount className="text-2xs">
								+{overflow.length}
							</AvatarGroupCount>
						</TooltipTrigger>
						<TooltipContent side="bottom" className="p-2">
							<ul className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
								{overflow.map((m) => (
									<li key={m.id} className="flex items-center gap-2">
										<Avatar size="sm">
											<AvatarImage src={m.avatarUrl} alt={m.name} />
											<AvatarFallback
												className={cn(
													"text-2xs font-semibold",
													getMemberTintClass(m.tintIndex)
												)}
											>
												{m.initials.slice(0, 2)}
											</AvatarFallback>
										</Avatar>
										<div className="min-w-0">
											<div className="truncate text-xs font-semibold">
												{m.name}
											</div>
											<div className="text-background/70 truncate text-xs">
												{m.email}
											</div>
										</div>
									</li>
								))}
							</ul>
						</TooltipContent>
					</Tooltip>
				) : null}
			</AvatarGroup>
		</TooltipProvider>
	);
}
