import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/styles";

type Props = {
	label: string;
	expanded: boolean;
	onToggle: () => void;
};

export function ConfigurationSectionHeader({
	label,
	expanded,
	onToggle,
}: Props) {
	return (
		<button
			type="button"
			onClick={onToggle}
			className="hover:bg-muted/40 flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left"
			aria-expanded={expanded}
		>
			<ChevronRight
				className={cn(
					"text-muted-foreground size-3 shrink-0 transition-transform",
					expanded && "rotate-90"
				)}
			/>
			<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
				{label}
			</span>
			<span className="bg-border h-px flex-1" />
		</button>
	);
}
