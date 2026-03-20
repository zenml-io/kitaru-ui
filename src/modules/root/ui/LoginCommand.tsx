import { Check, Copy01 } from "@untitledui/icons";
import { useCopy } from "@/shared/business-logic/use-copy";

export function LoginCommand({ url }: { url: string }) {
	const command = `kitaru login ${url}`;
	const { copied, copy } = useCopy(command);

	return (
		<div className="border-border text-muted-foreground bg-muted/30 hidden w-full max-w-3xs items-center gap-1 rounded-lg border px-3 py-1.5 sm:flex">
			<code className="min-w-0 flex-1 truncate text-left font-mono text-xs text-pretty">
				{command}
			</code>
			<button
				type="button"
				onClick={copy}
				className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
				aria-label={copied ? "Copied" : "Copy command"}
			>
				{copied ? (
					<Check className="text-success size-3.5" />
				) : (
					<Copy01 className="size-3.5" />
				)}
				<span className="sr-only">
					{copied ? "Command copied to clipboard" : "Copy command to clipboard"}
				</span>
			</button>
		</div>
	);
}
