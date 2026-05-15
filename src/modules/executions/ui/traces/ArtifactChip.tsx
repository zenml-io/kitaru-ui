import { File } from "lucide-react";
import { TruncatedText } from "@/shared/ui/truncated-text";
import { cn } from "@/shared/utils/styles";

type ArtifactChipProps = {
	name: string;
	isSelected: boolean;
	onClick: () => void;
};

export function ArtifactChip({ name, isSelected, onClick }: ArtifactChipProps) {
	return (
		<button
			type="button"
			className={cn(
				"inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-3 py-1 font-mono text-xs font-normal transition-colors",
				isSelected
					? "bg-primary text-primary-foreground border-transparent"
					: "border-border text-foreground hover:bg-accent"
			)}
			aria-pressed={isSelected}
			onClick={onClick}
		>
			<File className="size-3" />
			<TruncatedText className="max-w-[120px]">{name}</TruncatedText>
		</button>
	);
}
