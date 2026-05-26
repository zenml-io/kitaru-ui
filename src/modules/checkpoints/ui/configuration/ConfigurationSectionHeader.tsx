import { ChevronRight } from "lucide-react";
import { CollapsibleTrigger } from "@zenml/hashi/primitives/collapsible";

type ConfigurationSectionHeaderProps = {
	label: string;
};

export function ConfigurationSectionHeader({
	label,
}: ConfigurationSectionHeaderProps) {
	return (
		<CollapsibleTrigger className="hover:bg-muted/40 group flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left">
			<ChevronRight className="text-muted-foreground size-3 shrink-0 transition-transform group-data-[panel-open]:rotate-90" />
			<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
				{label}
			</span>
			<span className="bg-border h-px flex-1" />
		</CollapsibleTrigger>
	);
}
