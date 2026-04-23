import { Lock, Pin, Tag } from "lucide-react";
import { cn } from "@/shared/utils/styles";
import type { DeploymentTag, TagKind } from "../domain/deployment";

type Size = "sm" | "md";

const kindStyles: Record<TagKind, { shell: string; icon: typeof Lock }> = {
	default: {
		shell: "bg-primary/15 text-primary font-semibold",
		icon: Lock,
	},
	exclusive: {
		shell: "bg-accent text-accent-foreground border border-border",
		icon: Pin,
	},
	general: {
		shell: "bg-transparent text-muted-foreground border border-border",
		icon: Tag,
	},
};

const sizeStyles: Record<Size, { shell: string; icon: string }> = {
	sm: { shell: "h-5 text-2xs", icon: "size-2.5" },
	md: { shell: "h-[22px] text-2xs", icon: "size-3" },
};

const shellBase =
	"inline-flex items-center gap-1 px-1.5 rounded font-mono uppercase tracking-wider";

export function DeploymentTagChip({
	tag,
	size = "md",
	className,
}: {
	tag: DeploymentTag;
	size?: Size;
	className?: string;
}) {
	const Icon = kindStyles[tag.kind].icon;
	return (
		<span
			className={cn(
				shellBase,
				kindStyles[tag.kind].shell,
				sizeStyles[size].shell,
				className
			)}
		>
			<Icon className={cn("shrink-0", sizeStyles[size].icon)} aria-hidden />
			<span className="leading-none">{tag.name}</span>
		</span>
	);
}
