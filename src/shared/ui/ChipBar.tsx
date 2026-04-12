import { cn } from "@/shared/utils/styles";

type ChipBarGroup = {
	label: string;
	children: React.ReactNode;
};

type ChipBarProps = {
	groups: ChipBarGroup[];
	labelClassName?: string;
	className?: string;
};

export function ChipBar({ groups, labelClassName, className }: ChipBarProps) {
	return (
		<div
			className={cn(
				"border-border shrink-0 space-y-1.5 border-b px-4 py-3",
				className
			)}
		>
			{groups.map((group) => (
				<div key={group.label} className="flex flex-wrap items-center gap-1.5">
					<span
						className={cn(
							"text-muted-foreground text-2xs mr-1 w-14 shrink-0 font-semibold tracking-wider uppercase",
							labelClassName
						)}
					>
						{group.label}
					</span>
					{group.children}
				</div>
			))}
		</div>
	);
}
