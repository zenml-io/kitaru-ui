import { useState } from "react";
import { cn } from "@/shared/utils/styles";
import { ChevronRight } from "lucide-react";

type ExpandableRowProps = {
	header: React.ReactNode;
	children: React.ReactNode;
	onToggle?: () => void;
};

export function ExpandableRow({
	header,
	children,
	onToggle,
}: ExpandableRowProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div
			className={cn(
				"bg-card relative overflow-hidden rounded-lg border transition-colors",
				isExpanded
					? "border-border bg-card"
					: "border-border hover:bg-accent/30"
			)}
		>
			<button
				type="button"
				className={cn(
					"flex h-10 w-full cursor-pointer items-center gap-2 px-4 text-left",
					isExpanded && "border-border border-b"
				)}
				onClick={() => {
					setIsExpanded((prev) => !prev);
					onToggle?.();
				}}
			>
				<ChevronRight
					className={cn(
						"text-muted-foreground size-3.5 shrink-0 transition-transform",
						isExpanded && "rotate-90"
					)}
				/>
				{header}
			</button>

			{isExpanded && children}
		</div>
	);
}
