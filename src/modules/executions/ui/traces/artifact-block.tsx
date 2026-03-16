import { useState } from "react";
import { Collapsible } from "@base-ui/react/collapsible";
import { Copy, Check, ChevronDown } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

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
	const [copied, setCopied] = useState(false);

	const textToCopy = copyText ?? content ?? "";

	const handleCopy = () => {
		navigator.clipboard.writeText(textToCopy);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<Collapsible.Root
			defaultOpen={defaultOpen}
			className="group/artifact border-border mb-2.5 overflow-hidden rounded-md border"
		>
			<div className="bg-secondary hover:bg-secondary/80 group-data-[open]/artifact:border-border flex items-center justify-between px-3 py-1.5 transition-colors group-data-[open]/artifact:border-b">
				<Collapsible.Trigger className="flex cursor-pointer items-center gap-1.5">
					<ChevronDown className="text-muted-foreground h-3.5 w-3.5 transition-transform group-data-[closed]/artifact:-rotate-90" />
					<span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
						{label}
					</span>
				</Collapsible.Trigger>
				<IconButton
					icon={
						copied ? (
							<Check className="text-success h-3.5 w-3.5" />
						) : (
							<Copy className="text-muted-foreground h-3.5 w-3.5" />
						)
					}
					label={copied ? "Copied" : "Copy to clipboard"}
					size="icon-xs"
					className="opacity-0 transition-opacity group-hover/artifact:opacity-100"
					tooltipSide="top"
					onClick={handleCopy}
				/>
			</div>
			<Collapsible.Panel className="data-[open]:animate-in data-[open]:fade-in-0 data-[open]:slide-in-from-top-1 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:slide-out-to-top-1 overflow-hidden">
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
			</Collapsible.Panel>
		</Collapsible.Root>
	);
}
