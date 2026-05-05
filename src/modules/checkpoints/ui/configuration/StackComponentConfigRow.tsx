import { Lock } from "lucide-react";

type Props = {
	label: string;
	value?: string | number | boolean | null;
	isSecret?: boolean;
};

export function StackComponentConfigRow({ label, value, isSecret }: Props) {
	return (
		<div className="flex items-baseline gap-4 py-0.5">
			<span className="text-muted-foreground w-28 shrink-0 truncate text-xs">
				{label}
			</span>
			{isSecret ? (
				<span className="text-muted-foreground bg-muted inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-xs">
					<Lock className="size-3 shrink-0" />
					secret
				</span>
			) : (
				<span className="text-foreground truncate font-mono text-xs">
					{value === undefined || value === null ? "—" : String(value)}
				</span>
			)}
		</div>
	);
}
