import { Check, Copy } from "lucide-react";
import { useCopy } from "../business-logic/use-copy";
import { cn } from "../utils/styles";

export function CopyCommand({
	code,
	className,
}: {
	code: string;
	className?: string;
}) {
	const { copied, copy } = useCopy();

	return (
		<div
			className={cn(
				"bg-secondary text-2xs flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left",
				className
			)}
		>
			<code className="min-w-0 flex-1 truncate font-mono">{code}</code>
			<button
				type="button"
				onClick={() => copy(code)}
				className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
				aria-label="Copy to clipboard"
			>
				{copied ? (
					<Check className="text-success size-3.5" />
				) : (
					<Copy className="size-3.5" />
				)}
				<span className="sr-only">
					{copied ? "Command copied to clipboard" : "Copy command to clipboard"}
				</span>
			</button>
		</div>
	);
}
