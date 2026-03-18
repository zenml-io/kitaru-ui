import { File02 } from "@untitledui/icons";
import { cn } from "@/shared/utils/styles";

type ArtifactChipProps = {
	name: string;
	isSelected?: boolean;
	onClick?: () => void;
};

export function ArtifactChip({ name, isSelected, onClick }: ArtifactChipProps) {
	return (
		<button
			type="button"
			className={cn(
				"text-2xs inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 font-mono font-normal transition-colors",
				isSelected
					? "bg-primary text-primary-foreground border-transparent"
					: "border-border text-foreground hover:bg-accent"
			)}
			aria-pressed={isSelected}
			onClick={onClick}
		>
			<File02 className="size-3" />
			<span className="max-w-[120px] truncate">{name}</span>
		</button>
	);
}
