import { useState } from "react";
import { Check, Copy01 } from "@untitledui/icons";

export function CopyCommand({ code }: { code: string }) {
	const [copied, setCopied] = useState(false);

	function handleCopy() {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	}

	return (
		<div className="bg-secondary flex items-center justify-between gap-2 rounded-md px-3 py-2">
			<code className="text-foreground text-2xs truncate font-mono">
				{code}
			</code>
			<button
				type="button"
				onClick={handleCopy}
				className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
				aria-label="Copy to clipboard"
			>
				{copied ? (
					<Check className="size-3.5" />
				) : (
					<Copy01 className="size-3.5" />
				)}
			</button>
		</div>
	);
}
