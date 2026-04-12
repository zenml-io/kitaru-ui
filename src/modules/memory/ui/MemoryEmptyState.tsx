import { Database01, Download01, SearchRefraction } from "@untitledui/icons";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/shared/ui/empty";
import { cn } from "@/shared/utils/styles";

type MemoryEmptyStateProps = {
	variant: "no-memory" | "no-scope-memory" | "no-preview";
	scopeName?: string;
	className?: string;
};

const CONFIG = {
	"no-memory": {
		icon: Database01,
		title: "No memory yet",
		description:
			"This flow has no stored memory. Use memory.set() in your flow to start persisting state.",
	},
	"no-scope-memory": {
		icon: SearchRefraction,
		title: "No memory found",
		description: null,
	},
	"no-preview": {
		icon: Download01,
		title: "Preview unavailable",
		description:
			"This memory value cannot be previewed. Try downloading the artifact instead.",
	},
} as const;

export function MemoryEmptyState({
	variant,
	scopeName,
	className,
}: MemoryEmptyStateProps) {
	const config = CONFIG[variant];
	const Icon = config.icon;

	const description =
		variant === "no-scope-memory" && scopeName
			? `No memory entries found for scope "${scopeName}".`
			: config.description;

	return (
		<Empty className={cn("border-none", className)}>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Icon />
				</EmptyMedia>
				<EmptyTitle>{config.title}</EmptyTitle>
				{description && <EmptyDescription>{description}</EmptyDescription>}
			</EmptyHeader>
		</Empty>
	);
}
