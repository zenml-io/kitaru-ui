import { cn } from "@zenml/hashi/lib/utils";
import { LockedResourceTag } from "@zenml/hashi/components/LockedResourceTag";

export type StackComponentHeaderChipResource = {
	name: string;
	permissionDenied: boolean;
	type: string;
	flavorName?: string;
	logoUrl?: string;
};

export function StackComponentHeaderChip({
	component,
}: {
	component: StackComponentHeaderChipResource;
}) {
	if (component.permissionDenied) {
		return <LockedResourceTag name={component.name} />;
	}

	return (
		<span
			className={cn(
				"inline-flex h-6 items-center gap-1.5 rounded-md px-2",
				"border-border bg-card border",
				"text-foreground font-mono text-xs"
			)}
			title={`${component.type}: ${component.flavorName ?? component.name}`}
		>
			{component.logoUrl && (
				<img
					src={component.logoUrl}
					alt=""
					className="size-3.5 shrink-0"
					aria-hidden
				/>
			)}
			<span className="truncate">{component.flavorName ?? component.name}</span>
		</span>
	);
}
