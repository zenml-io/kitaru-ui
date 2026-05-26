import { Check, Copy, Link2 } from "lucide-react";
import { useCopy } from "@/shared/business-logic/use-copy";
import { Button } from "@zenml/hashi/primitives/button";
import { cn } from "@/shared/utils/styles";

export function InvocationUrlBlock({
	url,
	className,
}: {
	url: string;
	className?: string;
}) {
	const { copied, copy } = useCopy();

	return (
		<div
			className={cn(
				"border-border bg-card flex items-center gap-2 rounded-md border py-1 pr-1 pl-2.5",
				"text-foreground font-mono text-xs",
				className
			)}
			title={url}
		>
			<Link2 className="text-muted-foreground size-3.5 shrink-0" aria-hidden />
			<span className="min-w-0 flex-1 truncate">{url}</span>
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={() => copy(url)}
				aria-label={copied ? "Copied" : "Copy invocation URL"}
				className="shrink-0"
			>
				{copied ? (
					<Check className="text-success size-3.5" />
				) : (
					<Copy className="size-3.5" />
				)}
			</Button>
		</div>
	);
}
