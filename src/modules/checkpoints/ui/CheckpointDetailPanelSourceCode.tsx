import { Check, Copy, Expand, File, X } from "lucide-react";
import { useCopy } from "@/shared/business-logic/use-copy";
import { Button } from "@/shared/ui/button";
import { CodeBlock } from "@/shared/ui/CodeBlock";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/ui/dialog";
import { Separator } from "@/shared/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { TruncatedText } from "@/shared/ui/truncated-text";
import type { CheckpointSource } from "../domain/checkpoint";
import { filePathToFileName } from "../util/file-path";

interface CheckpointDetailPanelSourceCodeProps {
	source?: CheckpointSource;
}

export function CheckpointDetailPanelSourceCode({
	source,
}: CheckpointDetailPanelSourceCodeProps) {
	const { copied, copy } = useCopy();

	if (!source) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-1 p-4 text-center">
				<p className="text-foreground text-xs font-medium">
					No source code available.
				</p>
				<p className="text-muted-foreground text-xs">
					Source code is not recorded for this checkpoint.
				</p>
			</div>
		);
	}

	const fileName = source.filePath
		? filePathToFileName(source.filePath)
		: undefined;

	return (
		<div className="flex h-full flex-col">
			<Dialog>
				<div className="border-border flex shrink-0 items-center gap-2.5 border-b px-4 py-3">
					<File className="text-muted-foreground size-3.5 shrink-0" />
					<div className="min-w-0 flex-1">
						{fileName && (
							<div className="text-foreground truncate font-mono text-xs font-semibold">
								{fileName}
							</div>
						)}
						{source.filePath && (
							<div className="text-2xs text-muted-foreground truncate">
								{source.filePath}
							</div>
						)}
					</div>
					<div className="flex shrink-0 items-center gap-0.5">
						<Tooltip>
							<TooltipTrigger
								render={
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => copy(source.code)}
										aria-label="Copy source code"
									>
										{copied ? (
											<Check className="text-success size-3.5" />
										) : (
											<Copy className="size-3.5" />
										)}
									</Button>
								}
							/>
							<TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger
								render={
									<DialogTrigger
										render={
											<Button
												variant="ghost"
												size="icon-sm"
												aria-label="Open fullscreen"
											>
												<Expand className="size-3.5" />
											</Button>
										}
									/>
								}
							/>
							<TooltipContent>Fullscreen</TooltipContent>
						</Tooltip>
					</div>
				</div>
				<div className="min-h-0 flex-1 overflow-auto">
					<CodeBlock code={source.code} language="python" />
				</div>
				<DialogContent
					showCloseButton={false}
					className="flex h-[90vh] w-[90vw] flex-col gap-0 p-0 sm:max-w-[90vw]"
				>
					<DialogHeader className="bg-muted/50 flex-row items-center justify-between gap-2 px-4 py-2">
						<DialogTitle className="text-foreground min-w-0 flex-1 text-xs font-semibold">
							<TruncatedText>{source.filePath ?? "Source code"}</TruncatedText>
						</DialogTitle>
						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => copy(source.code)}
								aria-label="Copy source code"
							>
								{copied ? (
									<Check className="text-success size-3.5" />
								) : (
									<Copy className="size-3.5" />
								)}
							</Button>
							<DialogClose
								render={
									<Button variant="ghost" size="icon-sm">
										<X className="text-foreground size-3.5" />
										<span className="sr-only">Close</span>
									</Button>
								}
							/>
						</div>
					</DialogHeader>
					<Separator />
					<div className="min-h-0 flex-1 overflow-auto">
						<CodeBlock code={source.code} language="python" />
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
