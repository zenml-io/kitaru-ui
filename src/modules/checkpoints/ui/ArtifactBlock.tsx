import { useCopy } from "@/shared/business-logic/use-copy";
import { Button } from "@zenml/hashi/primitives/button";
import { cn } from "@/shared/utils/styles";
import { Check, ChevronDown, Copy } from "lucide-react";
import { useState } from "react";

interface ArtifactBlockProps {
	label: string;
	content?: string;
	copyText?: string;
	isJson?: boolean;
	defaultOpen?: boolean;
	children?: React.ReactNode;
}

export function ArtifactBlock({
	label,
	content,
	copyText,
	isJson,
	defaultOpen = true,
	children,
}: ArtifactBlockProps) {
	const [open, setOpen] = useState(defaultOpen);
	const textToCopy = copyText ?? content ?? "";
	const { copied, copy } = useCopy();

	return (
		<div className="group/artifact border-border mb-2.5 overflow-hidden rounded-md border">
			<div className="bg-secondary hover:bg-secondary/80 flex items-center justify-between px-3 py-1.5 transition-colors">
				<button
					type="button"
					className="flex cursor-pointer items-center gap-1.5"
					onClick={() => setOpen((o) => !o)}
				>
					<ChevronDown
						className={cn(
							"text-muted-foreground h-3.5 w-3.5 transition-transform",
							!open && "-rotate-90"
						)}
					/>
					<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
						{label}
					</span>
				</button>
				<Button
					variant="ghost"
					size="icon-sm"
					className="opacity-0 transition-opacity group-hover/artifact:opacity-100"
					onClick={() => copy(textToCopy)}
				>
					{copied ? (
						<Check className="text-success h-3.5 w-3.5" />
					) : (
						<Copy className="text-muted-foreground h-3.5 w-3.5" />
					)}
					<span className="sr-only">
						{copied ? "Copied" : "Copy to clipboard"}
					</span>
				</Button>
			</div>
			{open && (
				<div>
					{children ?? (
						<div
							className={cn(
								"bg-background max-h-[300px] overflow-y-auto p-3 font-mono text-xs leading-snug break-words whitespace-pre-wrap",
								isJson ? "text-success" : "text-foreground"
							)}
						>
							{content}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
