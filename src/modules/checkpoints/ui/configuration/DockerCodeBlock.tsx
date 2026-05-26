import { Check, Copy } from "lucide-react";
import { useCopy } from "@/shared/business-logic/use-copy";
import { Button } from "@zenml/hashi/primitives/button";
import { CodeBlock } from "@/shared/ui/CodeBlock";

type DockerCodeBlockProps = {
	label: string;
	code: string;
	/** Pass a CodeBlock-supported language (e.g. "dockerfile"). Omit for plain monospace. */
	language?: string;
};

export function DockerCodeBlock({
	label,
	code,
	language,
}: DockerCodeBlockProps) {
	const { copied, copy } = useCopy();
	return (
		<div className="bg-card border-border overflow-hidden rounded-lg border">
			<div className="bg-muted/40 border-border flex items-center gap-2 border-b px-3 py-1">
				<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
					{label}
				</span>
				<span className="flex-1" />
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={() => copy(code)}
					aria-label={`Copy ${label}`}
				>
					{copied ? (
						<Check className="text-success size-3.5" />
					) : (
						<Copy className="size-3.5" />
					)}
				</Button>
			</div>
			<CodeBlock code={code} language={language} />
		</div>
	);
}
