import { Database01 } from "@untitledui/icons";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/utils/styles";
import type { MemoryScopeType } from "../domain/memory";

const SCOPE_COLOR: Record<MemoryScopeType, string> = {
	namespace: "text-info",
	flow: "text-primary",
	execution: "text-muted-foreground",
	unknown: "text-muted-foreground",
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
			size="lg"
			className={cn(
				"shrink-0 cursor-pointer gap-1 font-mono font-normal transition-colors",
				isSelected && "bg-primary text-primary-foreground",
				!isSelected && "hover:bg-accent",
				isDeleted && "line-through opacity-60"
			)}
			aria-pressed={isSelected}
			onClick={onClick}
			title={label}
		>
			<Database01
				className={cn(
					"size-3 shrink-0",
					isSelected ? "text-primary-foreground/70" : SCOPE_COLOR[scopeType]
				)}
			/>
			<span className="max-w-40 truncate">{label}</span>
		</Badge>
	);
}
