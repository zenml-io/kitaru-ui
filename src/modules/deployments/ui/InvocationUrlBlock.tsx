import { Copy } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/styles";

export function InvocationUrlBlock({
	url,
	className,
}: {
	url: string;
	className?: string;
}) {
	function handleCopy() {
		void navigator.clipboard.writeText(url);
	}
	return (
		<div
			className={cn(
				"border-border bg-card inline-flex items-center gap-2 rounded-md border px-3 py-1.5",
				"text-foreground font-mono text-xs",
				className
			)}
		>
			<span className="truncate">{url}</span>
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={handleCopy}
				aria-label="Copy invocation URL"
			>
				<Copy className="size-3.5" />
			</Button>
		</div>
	);
}
