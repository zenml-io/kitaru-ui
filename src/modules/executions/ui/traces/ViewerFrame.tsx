import {
	createContext,
	useContext,
	useLayoutEffect,
	useState,
	type ReactNode,
} from "react";
import { Check, Copy } from "lucide-react";

import { useCopy } from "@/shared/business-logic/use-copy";
import { Button } from "@zenml/hashi/primitives/button";
import { CodeBlock } from "@/shared/ui/CodeBlock";
import { cn } from "@/shared/utils/styles";

type ViewerFrameType = "json" | "markdown" | "csv" | "html" | "image" | "text";

type ViewerFrameProps = {
	type: ViewerFrameType;
	rendered: ReactNode;
	rawText: string;
	copyText?: string;
	sizeLabel?: string;
	decodedFromJson?: boolean;
	rawLanguage?: string;
	density?: "compact" | "default";
};

const COLLAPSED_HEIGHT_PX = 320;

const ViewerFrameClampContext = createContext(true);

export function ViewerFrameFullHeight({ children }: { children: ReactNode }) {
	return (
		<ViewerFrameClampContext.Provider value={false}>
			{children}
		</ViewerFrameClampContext.Provider>
	);
}

export function ViewerFrame({
	type,
	rendered,
	rawText,
	copyText,
	sizeLabel,
	decodedFromJson,
	rawLanguage = "text",
	density = "default",
}: ViewerFrameProps) {
	const clampEnabled = useContext(ViewerFrameClampContext);
	const [showRaw, setShowRaw] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const [isOverflowing, setIsOverflowing] = useState(false);
	const [renderedBody, setRenderedBody] = useState<HTMLDivElement | null>(null);
	const { copied, copy } = useCopy();

	useLayoutEffect(() => {
		if (!clampEnabled || showRaw || !renderedBody) return;

		const check = () => {
			setIsOverflowing(renderedBody.scrollHeight > COLLAPSED_HEIGHT_PX);
		};
		check();
		const observer = new ResizeObserver(check);
		observer.observe(renderedBody);
		return () => observer.disconnect();
	}, [clampEnabled, showRaw, renderedBody]);

	const canCollapse = clampEnabled && !showRaw && isOverflowing;
	const shouldClamp = canCollapse && !expanded;
	const displayedCopyText = showRaw ? rawText : (copyText ?? rawText);

	return (
		<section className="bg-background overflow-hidden rounded-md">
			<header className="border-border bg-muted/30 flex items-center gap-2 border-b px-3 py-2">
				<span className="bg-secondary text-secondary-foreground rounded px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide uppercase">
					{type}
				</span>
				{decodedFromJson && (
					<span className="border-border text-muted-foreground rounded border px-2 py-0.5 text-[10px] font-medium">
						Decoded from JSON
					</span>
				)}
				{sizeLabel && (
					<span className="text-muted-foreground text-[10px]">{sizeLabel}</span>
				)}
				<div className="flex-1" />
				<div className="border-border bg-background flex overflow-hidden rounded-md border p-0.5">
					<Button
						variant={showRaw ? "ghost" : "secondary"}
						size="xs"
						className="h-5 rounded-sm px-2 text-[10px]"
						aria-pressed={!showRaw}
						onClick={() => setShowRaw(false)}
					>
						Rendered
					</Button>
					<Button
						variant={showRaw ? "secondary" : "ghost"}
						size="xs"
						className="h-5 rounded-sm px-2 text-[10px]"
						aria-pressed={showRaw}
						onClick={() => setShowRaw(true)}
					>
						Raw
					</Button>
				</div>
				<Button
					variant="ghost"
					size="icon-xs"
					onClick={() => copy(displayedCopyText)}
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
			</header>
			<div className="relative">
				{showRaw ? (
					<CodeBlock code={rawText} language={rawLanguage} wrap />
				) : (
					<div
						ref={setRenderedBody}
						className={cn(
							shouldClamp && "max-h-80 overflow-hidden",
							density === "compact" ? "text-xs" : "text-sm"
						)}
					>
						{rendered}
					</div>
				)}
				{shouldClamp && (
					<div className="from-background absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t to-transparent pt-10 pb-3">
						<Button
							variant="outline"
							size="xs"
							onClick={() => setExpanded(true)}
						>
							Show full content
						</Button>
					</div>
				)}
				{canCollapse && expanded && (
					<div className="flex justify-center pt-3 pb-3">
						<Button
							variant="outline"
							size="xs"
							onClick={() => setExpanded(false)}
						>
							Collapse
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}
