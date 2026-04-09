import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/utils/styles";
import type { MemoryScopeType } from "../domain/memory";

const SCOPE_COLOR: Record<MemoryScopeType, string> = {
	namespace: "bg-info",
	flow: "bg-primary",
	execution: "bg-muted-foreground",
	unknown: "bg-muted-foreground",
};

type MemoryChipProps = {
	label: string;
	scopeType: MemoryScopeType;
	isSelected?: boolean;
	isDeleted?: boolean;
	onClick?: () => void;
};

export function MemoryChip({
	label,
	scopeType,
	isSelected,
	isDeleted,
	onClick,
}: MemoryChipProps) {
	return (
		<Badge
			render={<button type="button" />}
			variant={isSelected ? "default" : "outline"}
			className={cn(
				"text-2xs shrink-0 cursor-pointer gap-1 px-2 py-0.5 font-mono font-normal transition-colors",
				isSelected && "bg-primary text-primary-foreground",
				!isSelected && "hover:bg-accent",
				isDeleted && "line-through opacity-60"
			)}
			aria-pressed={isSelected}
			onClick={onClick}
		>
			<span
				className={cn(
					"size-1.5 shrink-0 rounded-full",
					isSelected ? "bg-primary-foreground/70" : SCOPE_COLOR[scopeType]
				)}
			/>
			<span className="max-w-30 truncate">{label}</span>
		</Badge>
	);
}
